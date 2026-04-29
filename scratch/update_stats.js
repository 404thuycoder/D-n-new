const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
// Sửa đường dẫn để trỏ đúng vào thư mục models
const Place = require('../models/Place');

async function updateStats() {
  try {
    await mongoose.connect(process.env.MONGODB_URI.trim());
    const places = await Place.find({});
    console.log(`Đang xử lý ${places.length} địa điểm...`);
    for (let p of places) {
      p.favoritesCount = Math.floor(Math.random() * 150) + 50;
      p.ratingAvg = (4.2 + Math.random() * 0.7).toFixed(1);
      p.reviewCount = Math.floor(Math.random() * 100) + 30;
      await p.save();
    }
    console.log(`✅ Thành công! Đã cập nhật chỉ số cho ${places.length} địa điểm.`);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi cập nhật:', err);
    process.exit(1);
  }
}

updateStats();
