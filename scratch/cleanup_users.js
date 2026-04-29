require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MAIN_ADMIN_EMAIL = 'admin@wanderviet.com';

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Đã kết nối MongoDB để dọn dẹp...');

    const result = await User.deleteMany({ email: { $ne: MAIN_ADMIN_EMAIL } });
    console.log(`[✓] Đã xóa thành công ${result.deletedCount} tài khoản ảo/test.`);
    
    // Đảm bảo tài khoản còn lại là Super Admin
    const admin = await User.findOne({ email: MAIN_ADMIN_EMAIL });
    if (admin) {
      admin.isAdmin = true;
      admin.isSuperAdmin = true;
      admin.role = 'superadmin';
      await admin.save();
      console.log(`[i] Đã xác nhận quyền Super Admin cho: ${MAIN_ADMIN_EMAIL}`);
    }

    console.log('✨ Hệ thống đã được dọn dẹp sạch sẽ!');
  } catch (err) {
    console.error('Lỗi dọn dẹp:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

cleanup();
