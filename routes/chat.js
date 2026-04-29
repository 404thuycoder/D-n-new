const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./auth');
const User = require('../models/User');
const Knowledge = require('../models/Knowledge');
const Conversation = require('../models/Conversation');
const chatbotDb = require('../models/dbChatbot');
const fs = require('fs');
const path = require('path');

// Khởi tạo Groq (Bộ não AI siêu tốc)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// Khởi tạo Groq Business riêng (Không bị dính limit với user thường)
const groqBusiness = new Groq({ apiKey: process.env.GROQ_API_KEY_BUSINESS || process.env.GROQ_API_KEY });

// Middleware xác thực tùy chọn
const optionalAuth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded.user || decoded.account || decoded;
    } catch (e) { }
  }
  next();
};

// Nạp danh sách điểm đến để hỗ trợ xác định vị trí (Cache để tăng tốc)
let cachedPlaces = [];
try {
  const content = fs.readFileSync(path.join(__dirname, '../apps/user-web/places-data.js'), 'utf-8');
  const extractJson = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
  cachedPlaces = eval(extractJson);
} catch (e) {
  console.error("Lỗi đọc places-data trong chat:", e);
}

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { message, coords, itinerary, activeTrip, deviceId, role, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, answer: 'Vui lòng nhập câu hỏi.' });
    }

    // Định danh người dùng/phiên
    const sessionKey = req.user ? req.user.id : (deviceId || 'anonymous_guest');

    // --- QUICK RESPONSE ---
    const targetLang = req.body.lang || 'auto';
    const lowerMsg = message.toLowerCase().trim().replace(/[?.,!]$/, "");
    const quickGreetings = ['alo', 'chào', 'hi', 'hello', 'ơi', 'ê', 'hey', 'ê hả'];

    if (quickGreetings.includes(lowerMsg)) {
      // Chỉ sử dụng Quick Response tiếng Việt nếu:
      // 1. targetLang là 'vi'
      // 2. targetLang là 'auto' VÀ từ khóa chào hỏi là thuần Việt
      const isVietnameseIntent = (targetLang === 'vi') || (targetLang === 'auto' && ['alo', 'chào', 'ơi', 'ê', 'ê hả'].includes(lowerMsg));

      // Nếu là ngôn ngữ khác (en, jp, kr, fr), BẮT BUỘC bỏ qua Quick Response để AI tự trả lời đúng thứ tiếng
      if (isVietnameseIntent) {
        return res.json({
          success: true,
          answer: "Chào bạn! Mình là Trợ lý du lịch WanderViệt đây. Bạn cần mình tư vấn địa điểm nào hay có thắc mắc gì về chuyến đi không?",
          source: 'quick-response'
        });
      }
    }

    // 1. Phân tích Lịch sử hội thoại từ SERVER theo Session
    let chatHistory = [];
    let currentSessionId = sessionId; // Dùng sessionId từ frontend nếu có

    if (chatbotDb.readyState === 1 && currentSessionId) {
      try {
        const recentLogs = await Conversation.find({ sessionId: currentSessionId })
          .sort({ timestamp: -1 })
          .limit(10);

        if (recentLogs.length > 0) {
          chatHistory = recentLogs.reverse().map(log => ({
            role: log.role === 'user' ? 'user' : 'assistant',
            content: log.text
          }));
        }
      } catch (err) {
        console.warn("⚠️ Lỗi truy xuất lịch sử:", err.message);
      }
    }

    // 2. Xử lý ngữ cảnh hành trình & vị trí
    let tripContext = "Khách đang khám phá tự do.";
    if (itinerary && itinerary.length > 0) {
      const stops = itinerary.map(s => s.name || s).join(' -> ');
      tripContext = `Khách đang đi theo chuyến: "${activeTrip || 'Hành trình thông minh'}". Lộ trình dự kiến: ${stops}.`;
    }

    let locationContext = "Chưa xác định rõ vị trí GPS.";
    if (coords && coords.lat && coords.lng) {
      const nearest = cachedPlaces.find(p => {
        const d = Math.sqrt(Math.pow(p.lat - coords.lat, 2) + Math.pow(p.lng - coords.lng, 2));
        return d < 0.5;
      });
      if (nearest) locationContext = `Vị trí hiện tại: ${nearest.name} (${nearest.region}). Đặc tả: ${nearest.text}.`;
    }

    // --- START SMART CACHE (TRÍ NHỚ PHẢN XẠ) ---
    // Kiểm tra câu hỏi có trong Database chưa để tiết kiệm API (Chỉ áp dụng cho tiếng Việt hoặc Auto)
    if (chatbotDb.readyState === 1 && message.length > 2 && (targetLang === 'vi' || targetLang === 'auto')) {
      try {
        // A. Ưu tiên tìm trong bảng Knowledge (Kiến thức Admin soạn)
        const knowledgeMatch = await Knowledge.findOne({
          $or: [
            { question: lowerMsg },
            { question: message.trim() }
          ]
        });

        if (knowledgeMatch) {
          console.log("➡️ [SmartCache] Khớp kiến thức Admin:", knowledgeMatch.question);
          return res.json({
            success: true,
            answer: knowledgeMatch.answer,
            source: 'smart-cache-knowledge'
          });
        }

        // B. Tìm trong lịch sử hội thoại toàn cầu (Global Conversation Cache)
        const contextKeywords = ['đây', 'bây giờ', 'tối nay', 'hiện tại', 'này', 'mình', 'tôi', 'em'];
        const isContextSensitive = contextKeywords.some(k => lowerMsg.includes(k));

        if (!isContextSensitive && lowerMsg.length > 10) {
          // Tìm câu trả lời gần nhất cho câu hỏi y hệt này
          const prevQuestion = await Conversation.findOne({
            role: 'user',
            text: { $regex: new RegExp(`^${message.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
          }).sort({ timestamp: -1 });

          if (prevQuestion) {
            const prevAnswer = await Conversation.findOne({
              role: 'model',
              timestamp: { $gt: prevQuestion.timestamp }
            }).sort({ timestamp: 1 });

            if (prevAnswer && prevAnswer.text) {
              console.log("➡️ [SmartCache] Khớp lịch sử cộng đồng:", message);
              return res.json({
                success: true,
                answer: prevAnswer.text,
                source: 'smart-cache-history'
              });
            }
          }
        }
      } catch (cacheErr) {
        console.error("⚠️ SmartCache Error:", cacheErr.message);
      }
    }
    // --- END SMART CACHE ---

    // 3. Khởi tạo System Prompt chuyên biệt theo vai trò và BỐI CẢNH TRANG (SCOPE)
    let systemPrompt = "";
    const userRole = role || (req.user ? req.user.role : 'user');
    const scope = req.body.scope || 'user_portal'; // Mặc định là trang người dùng

    if (scope === 'admin_portal') {
      systemPrompt = `
BẠN LÀ: Trợ lý Quản trị cao cấp WanderViệt (Admin Portal).
NHIỆM VỤ: Chỉ hỗ trợ về quản lý hệ thống, kiểm duyệt dịch vụ, báo cáo doanh thu và kỹ thuật.
CẢNH BÁO: TUYỆT ĐỐI KHÔNG trả lời các câu hỏi về du lịch hay tư vấn tour ở đây.
`;
    } else if (scope === 'business_portal') {
      systemPrompt = `
BẠN LÀ: Chuyên gia Tư vấn Doanh nghiệp WanderViệt (Business Portal).
NHIỆM VỤ: Chỉ hỗ trợ doanh nghiệp về tối ưu hóa dịch vụ, mô tả quán ăn/khách sạn, và mẹo kinh doanh du lịch.
CẢNH BÁO: TUYỆT ĐỐI KHÔNG tư vấn du lịch cá nhân cho khách lẻ ở đây.
`;
    } else {
      // Mặc định cho User Portal
      systemPrompt = `
BẠN LÀ: Hướng dẫn viên du lịch WanderViệt (User Portal).
NHIỆM VỤ: Chỉ tư vấn về địa điểm, lịch trình, mẹo du lịch và văn hóa Việt Nam.
CẢNH BÁO: TUYỆT ĐỐI KHÔNG trả lời các câu hỏi về quản trị hệ thống hay kỹ thuật backend.
`;
    }

    // Thêm chỉ dẫn về phong cách xưng hô
    if (userRole === 'admin' || userRole === 'superadmin') {
      systemPrompt += "PHONG CÁCH: Chuyên nghiệp, bảo mật, tập trung vào dữ liệu.\n";
    } else if (userRole === 'business') {
      systemPrompt += "PHONG CÁCH: Lịch sự, nhạy bén kinh doanh, xưng 'Tôi' và gọi 'Doanh nghiệp'.\n";
    } else {
      systemPrompt += "PHONG CÁCH: Thân thiện, hào hứng, xưng 'mình' gọi 'bạn'.\n";
    }

    // --- AI CONTEXT GUARD: ÉP AI CHỈ TRẢ LỜI ĐÚNG PHẠM VI ---
    systemPrompt += `
QUY TẮC CỐT LÕI (CORE RULES):
1. Nếu người dùng hỏi các nội dung KHÔNG liên quan đến nhiệm vụ "${scope}" của bạn, hãy trả lời: "Xin lỗi, với vai trò trợ lý ở trang này, tôi không thể trả lời câu hỏi đó. Vui lòng chuyển sang trang phù hợp để được hỗ trợ tốt nhất."
2. Luôn giữ bí mật các thông tin nhạy cảm của hệ thống.
`;

    // Thêm ngữ cảnh thời gian thực & Ngôn ngữ
    const languageNames = {
      'vi': 'Tiếng Việt',
      'en': 'English',
      'jp': 'Japanese (日本語)',
      'kr': 'Korean (한국어)',
      'fr': 'French (Français)'
    };

    // Tạo chỉ dẫn ngôn ngữ cực kỳ nghiêm ngặt (Language Jail)
    let langRule = "";
    if (targetLang === 'auto') {
      langRule = "DETECT: Identify the user's language and respond ONLY in that language.";
    } else {
      const langName = languageNames[targetLang] || 'Tiếng Việt';
      langRule = `STRICT LANGUAGE MODE: You MUST respond ONLY in ${langName}. DO NOT use any other language.`;
    }

    // --- AI SELF-LEARNING MEMORY ---
    let userMemoryContext = "";
    if (req.user && req.user.id) {
      try {
        const fullUser = await User.findById(req.user.id).select('preferenceProfile');
        if (fullUser && fullUser.preferenceProfile && fullUser.preferenceProfile.aiInsights && fullUser.preferenceProfile.aiInsights.length > 0) {
          userMemoryContext = "AI MEMORY (Past Insights about this user): " + fullUser.preferenceProfile.aiInsights.join("; ");
        }
      } catch (err) {
        console.error("Lỗi lấy User Memory:", err.message);
      }
    }

    systemPrompt += `
${langRule}
CHARACTER: WanderViệt Assistant.
CONTEXT: ${locationContext} | ${tripContext}
${userMemoryContext ? userMemoryContext + '\n' : ''}USER ROLE: ${userRole} | CURRENT PAGE: ${scope}
LIMIT: Under 60 words.
`;

    try {
      // Ép model tuân thủ ngôn ngữ bằng cách nhúng thẳng lệnh vào câu hỏi cuối cùng
      let finalUserMessage = message;
      if (targetLang !== 'auto') {
        const langName = languageNames[targetLang] || 'Tiếng Việt';
        finalUserMessage = `${message}\n\n[SYSTEM INSTRUCTION: You MUST reply in ${langName}. Do NOT use any other language.]`;
      } else {
        finalUserMessage = `${message}\n\n[SYSTEM INSTRUCTION: Detect the language of my message and reply in that same language.]`;
      }

      // 4. Gọi Groq API
      // Sử dụng key riêng cho business
      const currentGroq = userRole === 'business' ? groqBusiness : groq;
      const completion = await currentGroq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...chatHistory,
          { role: "user", content: finalUserMessage }
        ],
        model: userRole === 'business' ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant",
        temperature: userRole === 'business' ? 0.7 : 0.6,
        max_tokens: userRole === 'business' ? 300 : 180
      });

      const aiAnswer = completion.choices[0]?.message?.content || "Mình chưa nghe rõ, bạn nói lại nhé!";

      // 5. LƯU TRÍ NHỚ (Ghi vào DB Server theo Session)
      if (chatbotDb.readyState === 1 && aiAnswer) {
        try {
          // Nếu chưa có sessionId (phiên mới), tạo một cái
          if (!currentSessionId) {
            currentSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            console.log("🆕 Generated new sessionId:", currentSessionId);
          }

          // Lấy tiêu đề từ tin nhắn đầu tiên (Xử lý thông minh hơn)
          let title = undefined;
          const firstMsgCount = await Conversation.countDocuments({ sessionId: currentSessionId });
          if (firstMsgCount === 0) {
            // Tự tạo tên ngắn gọn từ câu hỏi
            let cleanMsg = message.replace(/[?.,!]/g, '').trim();
            title = cleanMsg.split(' ').slice(0, 6).join(' ');
            if (cleanMsg.split(' ').length > 6) title += '...';
            if (!title) title = 'Hội thoại mới';
            console.log("📝 Set session title:", title);
          }


          await new Conversation({
            userId: sessionKey,
            sessionId: currentSessionId,
            title: title, // Chỉ lưu title nếu đây là tin nhắn đầu tiên
            role: 'user',
            text: message
          }).save();

          const answerDoc = await new Conversation({
            userId: sessionKey,
            sessionId: currentSessionId,
            role: 'model',
            text: aiAnswer
          }).save();
          
          res.locals.messageId = answerDoc._id; // Store to return later
        } catch (saveErr) {
          console.error("Lỗi lưu trí nhớ:", saveErr.message);
        }
      } else if (chatbotDb.readyState !== 1) {
        console.warn("⚠️ Chatbot DB not ready (readyState: " + chatbotDb.readyState + "). Message not saved.");
      }

      res.json({
        success: true,
        answer: aiAnswer,
        sessionId: currentSessionId,
        messageId: res.locals.messageId || null,
        source: 'groq-llama3-expert-v6'
      });

    } catch (groqError) {
      console.error('❌ Groq API Error Detail:', groqError);
      if (groqError.response && groqError.response.data) {
        console.error('Groq Response Data:', JSON.stringify(groqError.response.data));
      }
      res.status(500).json({ success: false, answer: "Bộ não AI siêu tốc đang bảo trì, vui lòng thử lại sau!" });
    }
  } catch (error) {
    console.error('Critical Chat Error:', error);
    res.status(500).json({ success: false, answer: 'Lỗi hệ thống.' });
  }
});

// Lấy danh sách các phiên chat của người dùng
router.get('/sessions', optionalAuth, async (req, res) => {
  try {
    const sessionKey = req.user ? req.user.id : (req.query.deviceId || 'anonymous_guest');
    console.log("🔍 Fetching sessions for userId:", sessionKey);

    // Group by sessionId to get unique sessions
    const sessions = await Conversation.aggregate([
      { $match: { userId: sessionKey, sessionId: { $exists: true, $ne: null } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$sessionId",
          title: { $max: "$title" },
          updatedAt: { $max: "$timestamp" }
        }
      },
      { $sort: { updatedAt: -1 } },
      { $limit: 20 }
    ]);
    console.log("📊 Sessions found:", sessions.length);

    const formatted = await Promise.all(sessions.map(async s => {
      let displayTitle = s.title;
      const sid = s._id;

      // Kiểm tra nếu tiêu đề rỗng hoặc là mặc định "Hội thoại mới"
      if (!displayTitle || displayTitle.trim() === 'Hội thoại mới' || displayTitle === 'null') {
        const firstUserMsg = await Conversation.findOne({ sessionId: sid, role: 'user' }).sort({ timestamp: 1 });
        if (firstUserMsg && firstUserMsg.text) {
          let clean = firstUserMsg.text.replace(/[?.,!]/g, '').trim();
          displayTitle = clean.split(' ').slice(0, 8).join(' ');
          if (clean.split(' ').length > 8) displayTitle += '...';
        }
      }

      if (!displayTitle) displayTitle = 'Hội thoại du lịch';

      return {
        sessionId: sid,
        title: displayTitle,
        updatedAt: s.updatedAt
      };
    }));

    res.json({ success: true, sessions: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải danh sách phiên.' });
  }
});

// Lấy lịch sử chi tiết của một phiên
router.get('/history/:sid', optionalAuth, async (req, res) => {
  try {
    const { sid } = req.params;
    const messages = await Conversation.find({ sessionId: sid }).sort({ timestamp: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải lịch sử.' });
  }
});

// Xóa một phiên chat
router.delete('/session/:sid', optionalAuth, async (req, res) => {
  try {
    const { sid } = req.params;
    const sessionKey = req.user ? req.user.id : (req.query.deviceId || 'anonymous_guest');

    // Đảm bảo người dùng chỉ xóa được chat của chính họ
    const result = await Conversation.deleteMany({ sessionId: sid, userId: sessionKey });

    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Đã xóa hội thoại.' });
    } else {
      res.status(404).json({ success: false, message: 'Không tìm thấy hội thoại hoặc không có quyền xóa.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa hội thoại.' });
  }
});

// Nhận phản hồi RLHF từ người dùng
router.post('/feedback', optionalAuth, async (req, res) => {
  try {
    const { messageId, feedback, reason } = req.body;
    if (!messageId || !['up', 'down', 'none'].includes(feedback)) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ.' });
    }

    const sessionKey = req.user ? req.user.id : (req.query.deviceId || 'anonymous_guest');
    
    // Cập nhật phản hồi vào Conversation
    const updated = await Conversation.findOneAndUpdate(
      { _id: messageId, userId: sessionKey },
      { $set: { feedback, feedbackReason: reason || '' } },
      { new: true }
    );

    if (updated) {
      res.json({ success: true, message: 'Cảm ơn phản hồi của bạn!' });
    } else {
      res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server.' });
  }
});

module.exports = router;
