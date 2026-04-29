const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY_NAVIGATION });

const { auth } = require('./auth');

// API để tư vấn AI cho tuyến đường
router.post('/ai-advice', auth, async (req, res) => {
  try {
    const { origin, destination, distance, duration, mode } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp điểm đi và điểm đến.' });
    }

    // Sinh ra prompt dựa trên lựa chọn
    let modeText = 'không xác định';
    if (mode === 'driving' || mode === 'car') modeText = 'ô tô';
    else if (mode === 'motorcycle' || mode === 'bike') modeText = 'xe máy';
    else if (mode === 'walking' || mode === 'foot') modeText = 'đi bộ';

    const prompt = `
Bạn là Trợ lý AI Cố vấn Lộ trình của WanderViệt.
Khách hàng chuẩn bị đi từ "${origin}" đến "${destination}".
Khoảng cách dự kiến: ${distance || 'không rõ'}, Thời gian dự kiến: ${duration || 'không rõ'}.
Phương tiện di chuyển: ${modeText}.

Nhiệm vụ của bạn: Đưa ra 1 bài phân tích/lời khuyên súc tích, thực tế và hữu ích (khoảng 3-5 câu). 
Lưu ý:
- Nếu đi bộ quãng đường quá xa, hãy cảnh báo.
- Nếu đi xe máy đường dài, hãy khuyên mang đồ bảo hộ và chú ý thời tiết/công an.
- Gợi ý nhẹ 1-2 điểm dừng chân hoặc món ăn đường phố nếu lộ trình phù hợp.
- Trả lời bằng chữ thường, định dạng văn bản HTML cơ bản (dùng <b>, <i>, <br>) để dễ hiển thị. Không dùng markdown json.
    `;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Bạn là trợ lý cố vấn lộ trình WanderViệt. Trả lời bằng HTML đơn giản.' },
        { role: 'user', content: prompt }
      ]
    });

    res.json({ success: true, advice: response.choices[0].message.content });
  } catch (error) {
    console.error('Lỗi API Directions AI:', error.message || error);
    res.status(500).json({ success: false, message: 'Hệ thống AI đang quá tải hoặc cấu hình lỗi.' });
  }
});

module.exports = router;
