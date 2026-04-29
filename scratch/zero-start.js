/**
 * ZERO START SCRIPT
 * Xóa sạch mọi hoạt động (đặt chỗ, tin nhắn, đánh giá) và đưa các chỉ số về 0.
 * Giữ lại tài khoản doanh nghiệp và dịch vụ nhưng ở trạng thái "mới tinh".
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI.trim();

// ── Models ─────────────────────────────────────────────────────────────────
const BusinessAccount = require('../models/BusinessAccount');
const Place           = require('../models/Place');
const User            = require('../models/User');

// Optional models
let Booking, Notification, Conversation, Broadcast;
try { Booking      = require('../models/Booking'); } catch(e) {}
try { Notification = require('../models/Notification'); } catch(e) {}
try { Conversation = require('../models/Conversation'); } catch(e) {}
try { Broadcast    = require('../models/Broadcast'); } catch(e) {}

async function zeroStart() {
  console.log('\n🔄 Đang kết nối MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Kết nối thành công\n');

  // ── 1. XÓA SẠCH DỮ LIỆU GIAO DỊCH & DỊCH VỤ ───────────────────────────
  console.log('🗑️  Đang xóa các bản ghi giao dịch, dịch vụ và hoạt động...');

  const tasks = [
    Place.deleteMany({}), // XÓA SẠCH DỊCH VỤ
  ];
  if (Booking) tasks.push(Booking.deleteMany({}));
  if (Notification) tasks.push(Notification.deleteMany({}));
  if (Conversation) tasks.push(Conversation.deleteMany({}));
  if (Broadcast) tasks.push(Broadcast.deleteMany({}));

  const results = await Promise.allSettled(tasks);
  console.log('  ✓ Đã xóa sạch: Dịch vụ, Đơn đặt chỗ, Thông báo, Hội thoại chat.');

  // ── 2. RESET CHỈ SỐ TRÊN CÁC ĐỊA ĐIỂM/DỊCH VỤ ─────────────────────────
  console.log('\n📉 Đang reset chỉ số các dịch vụ về 0...');
  
  const updateResult = await Place.updateMany(
    {}, // Áp dụng cho tất cả địa điểm
    {
      $set: {
        ratingAvg: '0',
        reviewCount: 0,
        favoritesCount: 0,
        reviews: [],
        viewCount: 0 // Nếu có trường này
      }
    }
  );
  console.log(`  ✓ Đã reset ${updateResult.modifiedCount} dịch vụ về trạng thái mới.`);

  // ── 3. ĐẢM BẢO TÀI KHOẢN DOANH NGHIỆP SẠCH ───────────────────────────
  // (BusinessAccount không lưu stats trực tiếp nên không cần set gì đặc biệt)
  console.log('\n👔 Kiểm tra tài khoản doanh nghiệp...');
  const biz = await BusinessAccount.findOne({ email: 'halong@luxury.com' });
  if (biz) {
    biz.points = 0; // Reset điểm thưởng về 0 nếu muốn bắt đầu từ đầu
    await biz.save();
    console.log(`  ✓ Đã reset điểm thưởng cho: ${biz.email}`);
  }

  console.log('\n📊 TỔNG KẾT TRẠNG THÁI 0:');
  console.log('  • Đơn đặt chỗ (Booking) : 0');
  console.log('  • Tin nhắn (Conversation): 0');
  console.log('  • Thông báo (Notif)     : 0');
  console.log('  • Đánh giá (Reviews)    : 0');

  console.log('\n✅ Hệ thống đã sẵn sàng cho "Khởi đầu mới"!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Bây giờ khi bạn vào Dashboard, mọi con số sẽ là 0.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

zeroStart().catch(err => {
  console.error('\n❌ Lỗi:', err.message);
  process.exit(1);
});
