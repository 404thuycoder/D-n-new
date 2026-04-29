require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Tài khoản Super Admin cố định của hệ thống
const SUPER_ADMIN_EMAIL = 'admin@wanderviet.com';
const SUPER_ADMIN_PASSWORD = 'admin123@';
const SUPER_ADMIN_NAME = 'Super Admin';

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Đã kết nối MongoDB...');

    // ── 1. Tạo/Cập nhật Super Admin chính
    let superAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });

    if (superAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, salt);
      
      superAdmin.password = hashedPassword;
      superAdmin.isAdmin = true;
      superAdmin.isSuperAdmin = true;
      await superAdmin.save();
      console.log(`[✓] Đã CẬP NHẬT mật khẩu và quyền Super Admin cho: ${SUPER_ADMIN_EMAIL}`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, salt);
      superAdmin = new User({
        name: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        isAdmin: true,
        isSuperAdmin: true,
        displayName: SUPER_ADMIN_NAME
      });
      await superAdmin.save();
      console.log(`[✓] Đã TẠO MỚI Super Admin: ${SUPER_ADMIN_EMAIL} | Mật khẩu: ${SUPER_ADMIN_PASSWORD}`);
    }

    // ── 2. Đảm bảo các admin cũ (isAdmin=true) KHÔNG có isSuperAdmin
    //       Giữ nguyên Sub-Admin, chỉ clear isSuperAdmin nếu chưa phải SUPER_ADMIN_EMAIL
    const otherAdmins = await User.find({ isAdmin: true, email: { $ne: SUPER_ADMIN_EMAIL } });
    for (const admin of otherAdmins) {
      if (admin.isSuperAdmin) {
        admin.isSuperAdmin = false;
        await admin.save();
        console.log(`[~] Đã hạ cấp: ${admin.email} → Sub-Admin`);
      }
    }

    if (otherAdmins.length === 0) {
      console.log('[i] Không có Sub-Admin nào khác trong hệ thống.');
    }

    mongoose.disconnect();
    console.log('\n✅ Hoàn thành phân quyền admin.');
    console.log(`   Super Admin: ${SUPER_ADMIN_EMAIL}`);
    console.log(`   Mật khẩu  : ${SUPER_ADMIN_PASSWORD}`);
  })
  .catch((err) => {
    console.error('Lỗi khi kết nối MongoDB:', err);
    process.exit(1);
  });
