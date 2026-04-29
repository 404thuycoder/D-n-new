require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const MAIN_EMAIL = 'admin@wanderviet.com';
const COMMON_PW = '12345678@'; // Mật khẩu chung cho các tài khoản test

async function hardRebuild() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Đang thực hiện thanh trừng toàn bộ tài khoản Admin rác...');

    // 1. Xóa TẤT CẢ những gì liên quan đến Admin hoặc email admin@wanderviet.com
    await User.deleteMany({ 
      $or: [
        { isAdmin: true }, 
        { isSuperAdmin: true }, 
        { email: MAIN_EMAIL },
        { role: 'admin' },
        { role: 'superadmin' }
      ] 
    });
    console.log('[✓] Đã xóa sạch các tài khoản Admin cũ và trùng lặp.');

    // 2. Tạo lại 1 Super Admin DUY NHẤT
    const hpw = await bcrypt.hash(COMMON_PW, 10);
    const superAdmin = new User({
      name: 'Super Admin',
      displayName: 'WanderViệt Boss',
      email: MAIN_EMAIL,
      password: hpw,
      role: 'superadmin',
      isAdmin: true,
      isSuperAdmin: true,
      status: 'active',
      notes: 'Mật khẩu: ' + COMMON_PW // Lưu vào ghi chú để hiện ở chi tiết
    });
    await superAdmin.save();
    console.log(`[✓] Đã tạo Super Admin duy nhất: ${MAIN_EMAIL} | PW: ${COMMON_PW}`);

    // 3. Tạo lại User & Business mẫu
    const u = new User({
      name: 'Thành viên mẫu',
      email: 'member@test.com',
      password: hpw,
      role: 'user',
      status: 'active',
      notes: 'Mật khẩu: ' + COMMON_PW
    });
    const b = new User({
      name: 'Doanh nghiệp mẫu',
      email: 'business@test.com',
      password: hpw,
      role: 'business',
      isBusiness: true,
      status: 'active',
      notes: 'Mật khẩu: ' + COMMON_PW
    });
    await u.save();
    await b.save();

    console.log('[✓] Đã khôi phục tài khoản Người dùng và Doanh nghiệp mẫu.');
    console.log('\n✨ XONG! Bây giờ chỉ còn đúng 3 tài khoản chuẩn.');
  } catch (err) {
    console.error('Lỗi:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

hardRebuild();
