const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY_NAVIGATION });

const { auth } = require('./auth');

// In-Memory Caching để giảm tải API và tăng tốc độ xử lý trả về cho Web
const routeCache = new Map();
const searchCache = new Map();
const CACHE_TTL = 1000 * 60 * 15; // 15 phút

// Proxy định tuyến — thử nhiều server dự phòng nếu server chính bị down
router.get('/proxy-route', auth, async (req, res) => {
  try {
    const { profile, coords } = req.query;
    if (!profile || !coords) return res.status(400).json({ success: false, message: 'Thiếu tham số' });

    const cacheKey = `${profile}-${coords}`;
    if (routeCache.has(cacheKey)) {
      const cached = routeCache.get(cacheKey);
      if (Date.now() - cached.time < CACHE_TTL) {
        return res.json(cached.data);
      }
    }

    // Danh sách OSRM servers dự phòng (thử lần lượt nếu cái trước fail)
    const osrmServers = [
      'https://router.project-osrm.org',
      'https://routing.openstreetmap.de'
    ];

    // Helper: fetch với timeout 8 giây tránh treo
    const fetchWithTimeout = (url, options = {}, timeoutMs = 8000) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
    };

    let data = null;
    for (const server of osrmServers) {
      try {
        const url = `${server}/route/v1/${profile}/${coords}?overview=full&geometries=geojson`;
        const response = await fetchWithTimeout(url, {
          headers: { 'User-Agent': 'WanderViet-Navigation/1.0 (contact@wanderviet.vn)' }
        }, 8000);
        const json = await response.json();
        if (json.code === 'Ok') {
          data = json;
          break; // Thoát ngay khi server đầu tiên trả OK
        }
      } catch (e) {
        console.warn(`OSRM server ${server} failed:`, e.message);
        // Thử server tiếp theo
      }
    }

    if (data) {
      routeCache.set(cacheKey, { time: Date.now(), data });
      return res.json(data);
    }

    // Không có server nào trả OK
    res.status(503).json({ success: false, message: 'Tất cả máy chủ chỉ đường đều không khả dụng lúc này.' });
  } catch (err) {
    console.error('OSRM Proxy Error:', err);
    res.status(500).json({ success: false, message: 'Lỗi Proxy' });
  }
});

// Proxy ẩn truy vấn địa điểm (tránh bị Nominatim block do thiếu User-Agent)
router.get('/proxy-search', auth, async (req, res) => {
  try {
    const { q, limit } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Thiếu tham số tìm kiếm' });
    const cacheKey = `${q}-${limit || 5}`;
    if (searchCache.has(cacheKey)) {
      const cached = searchCache.get(cacheKey);
      if (Date.now() - cached.time < CACHE_TTL) {
        return res.json(cached.data); // Trả về từ Cache
      }
    }
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=vn&limit=${limit || 5}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WanderViet-Navigation/1.0 (contact@wanderviet.vn)',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    const data = await response.json();
    searchCache.set(cacheKey, { time: Date.now(), data });
    res.json(data);
  } catch (err) {
    console.error('Nominatim Proxy Error:', err);
    res.status(500).json({ success: false, message: 'Lỗi Proxy Geocoding' });
  }
});

// Trí tuệ ảo Sắp xếp Lộ trình & Ước tính phương tiện
router.post('/plan-route', auth, async (req, res) => {
  try {
    const { places } = req.body; 
    // places là mảng các object: { name, lat, lng }

    if (!places || places.length < 2) {
      return res.status(400).json({ success: false, message: 'Cần ít nhất 2 địa điểm để định tuyến.' });
    }

    const placesStr = places.map((p, idx) => `[${idx}] ${p.name} (Tọa độ: ${p.lat}, ${p.lng})`).join('\n');

    const prompt = `
Bạn là Trợ lý AI Giao thông Nội bộ của WanderViệt.
Khách hàng muốn đi qua các điểm sau (Tọa độ và tên):
${placesStr}

Nhiệm vụ của bạn:
1. Sắp xếp lại thứ tự tối ưu nhất (giải Bài toán người giao hàng - TSP cơ bản, dựa theo toạ độ / địa lý tự suy diễn qua tọa độ và tên).
2. Quyết định phương tiện di chuyển hợp lý giữa các điểm (VD đoạn gần khuyên đi bộ, đoạn xa khuyên đi taxi, xe máy).
3. Dự tính chi phí đi lại giữa các chặng.
4. Dự đoán nếu dùng Ô Tô thì có đi qua cao tốc nào không và có thu phí không. 

Trả về RẤT NGHIÊM NGẶT bằng định dạng JSON (Không Markdown, KHÔNG COMMENT QUANH JSON):
{
  "optimizedOrder": [ số_index_của_places_sau_khi_xếp , ... ],
  "legs": [
    {
      "from": "tên điểm đi",
      "to": "tên điểm đến",
      "transport": "walking | car | motorcycle",
      "estimatedCost": "150.000 VNĐ",
      "highwayToll": "Không qua cao tốc",
      "advice": "Lời khuyên ngắn gọn..."
    }
  ]
}
Chỉ trả về Object JSON.
    `;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Bạn là chuyên gia định tuyến WanderViệt. Chỉ trả về JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    let aiPlanStr = response.choices[0].message.content;
    aiPlanStr = aiPlanStr.trim();

    let resultJson = JSON.parse(aiPlanStr);
    res.json({ success: true, aiRoute: resultJson });
  } catch(err) {
    console.error('AI Navigation Error:', err);
    res.status(500).json({ success: false, message: 'AI Không thể tối ưu lộ trình lúc này.' });
  }
});

module.exports = router;
