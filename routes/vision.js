const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/search', async (req, res) => {
  try {
    const { image } = req.body; // base64 string
    if (!image) return res.status(400).json({ success: false, message: 'No image provided' });

    // 1. Lấy danh sách tên địa điểm từ database để "nhắc bài" cho AI
    let placesData = [];
    let knownPlaceNames = "";
    try {
      const placesDataPath = path.join(__dirname, '../apps/user-web/places-data.js');
      const content = fs.readFileSync(placesDataPath, 'utf-8');
      const arrayMatch = content.match(/window\.WANDER_PLACES\s*=\s*(\[[\s\S]*\]);/);
      if (arrayMatch) {
        const arrayStr = arrayMatch[1];
        placesData = new Function('return ' + arrayStr)();
        knownPlaceNames = placesData.map(p => `${p.name} (${p.region})`).join(", ");
      }
    } catch (e) {
      console.error("Error reading places data:", e);
    }

    // 2. Phân tích hình ảnh bằng Groq Vision với danh sách tham chiếu
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Deeply analyze this image in the context of Vietnam tourism. 
              REFERENCE DATABASE (Important): Use this list of known places to find the BEST match if applicable: [${knownPlaceNames}].
              
              Task:
              1. Landmark/Location: Identify the specific spot. If it's in the REFERENCE DATABASE, use that EXACT name for "placeName".
              2. Atmospheric Analysis: Describe the 'vibe' (e.g., misty mountain, tropical beach).
              3. Visual Indicators: Note architecture, flora, or terrain.
              4. Recommendation Logic: If not a specific landmark, suggest 3-5 places from the REFERENCE DATABASE that share this atmosphere.
              
              Return a JSON object with:
              - "placeName": The identified name (prefer names from REFERENCE DATABASE).
              - "keywords": 10 descriptive keywords for matching.
              - "category": The primary travel category.
              - "vibeDescription": A short, poetic description (max 20 words).
              Return ONLY the JSON object.` 
            },
            {
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ],
      model: "llama-3.2-11b-vision-preview",
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0]?.message?.content || "{}");
    const identifiedName = analysis.placeName || "Địa điểm lạ";
    const keywords = analysis.keywords || [];
    const category = analysis.category || "";

    console.log("Visual Analysis (Enhanced):", analysis);

    // 3. Tìm kiếm thông minh trong database PLACES
    const matches = placesData.map(p => {
      let score = 0;
      const pName = p.name.toLowerCase();
      const pProvince = (p.province || "").toLowerCase();
      const pTags = (p.tags || []).map(t => t.toLowerCase());
      const pText = (p.text || "").toLowerCase();
      
      const targetName = identifiedName.toLowerCase();
      
      // 1. Khớp tên chính xác (Bonus cực lớn)
      if (targetName === pName) score += 50;
      else if (targetName.includes(pName) || pName.includes(targetName)) score += 20;
      
      // 2. Khớp tỉnh thành
      if (pProvince && targetName.includes(pProvince)) score += 15;
      
      // 3. Khớp danh mục
      if (category && (p.category === category || pTags.includes(category.toLowerCase()))) score += 10;
      
      // 4. Khớp từ khóa (Fuzzy Matching)
      keywords.forEach(kw => {
        const k = kw.toLowerCase();
        if (pName.includes(k)) score += 5;
        if (pTags.includes(k)) score += 4;
        if (pText.includes(k)) score += 2;
      });

      return { ...p, relevanceScore: score };
    })
    .filter(p => p.relevanceScore > 5) // Tăng ngưỡng lọc để kết quả chất lượng hơn
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 6);

    res.json({
      success: true,
      identifiedName: identifiedName,
      analysis: analysis,
      matches: matches
    });

  } catch (error) {
    console.error('Vision Search Error:', error);
    res.status(500).json({ success: false, message: 'Lỗi phân tích hình ảnh' });
  }
});

module.exports = router;
