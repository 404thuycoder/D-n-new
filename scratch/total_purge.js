require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const MAIN_EMAIL = 'admin@wanderviet.com';
const COMMON_PW = '12345678@';

async function totalPurge() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Đang thực hiện DỌN SẠCH TOÀN BỘ bảng người dùng...');

    // 1. Xóa TẤT CẢ mọi tài khoản trong hệ thống
    const delAll = await User.deleteMany({});
    console.log(`[✓] Đã xóa tổng cộng ${delAll.deletedCount} tài khoản.`);

    // 2. Tạo lại bộ 3 tài khoản chuẩn
    const hpw = await bcrypt.hash(COMMON_PW, 10);
    
    // Super Admin
    await new User({
      name: 'Super Admin',
      displayName: 'WanderViệt Boss',
      email: MAIN_EMAIL,
      password: hpw,
      role: 'superadmin',
      isAdmin: true,
      isSuperAdmin: true,
      status: 'active',
      notes: 'Mật khẩu: ' + COMMON_PW
    }).save();

    // User mẫu
    await new User({
      name: 'Thành viên mẫu',
      email: 'member@test.com',
      password: hpw,
      role: 'user',
      status: 'active',
      notes: 'Mật khẩu: ' + COMMON_PW
    }).save();

    // Business mẫu
    await new User({
      name: 'Doanh nghiệp mẫu',
      email: 'business@test.com',
      password: hpw,
      role: 'business',
      isBusiness: true,
      status: 'active',
      notes: 'Mật khẩu: ' + COMMON_PW
    }).save();

    console.log(`[✓] Đã tạo lại 3 tài khoản chuẩn với mật khẩu: ${COMMON_PW}`);
    console.log('\n✨ XONG! Hệ thống bây giờ siêu sạch.');
  } catch (err) {
    console.error('Lỗi thanh trừng:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

totalPurge();
