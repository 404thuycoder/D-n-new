require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const AdminAccount = require('../models/AdminAccount'); // Bảng admin riêng biệt
const bcrypt = require('bcryptjs');

const MAIN_EMAIL = 'admin@wanderviet.com';
const COMMON_PW = '12345678@';

async function finalDeepClean() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- BẮT ĐẦU DỌN DẸP SÂU ---');

    // 1. Xóa sạch bảng User
    const delUsers = await User.deleteMany({});
    console.log(`[✓] Đã xóa ${delUsers.deletedCount} tài khoản từ bảng User.`);

    // 2. Xóa sạch bảng AdminAccount (Đây là nơi chứa Toàn, Left Menu...)
    const delAdmins = await AdminAccount.deleteMany({});
    console.log(`[✓] Đã xóa ${delAdmins.deletedCount} tài khoản từ bảng AdminAccount.`);

    // 3. Tạo lại Super Admin duy nhất trong bảng User (Hệ thống ưu tiên bảng này)
    const hpw = await bcrypt.hash(COMMON_PW, 10);
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

    console.log(`[✓] Đã tạo lại Super Admin duy nhất: ${MAIN_EMAIL}`);
    console.log('\n✨ XONG! Bây giờ chắc chắn 100% là sạch bóng quân thù.');
  } catch (err) {
    console.error('Lỗi dọn dẹp sâu:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

finalDeepClean();
