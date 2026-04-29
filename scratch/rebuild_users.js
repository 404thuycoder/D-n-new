require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MAIN_EMAIL = 'admin@wanderviet.com';

async function rebuildUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Bắt đầu sắp xếp lại tài khoản...');

    // 1. Xử lý Super Admin: Xóa hết và chỉ tạo lại 1 cái sạch sẽ
    await User.deleteMany({ email: MAIN_EMAIL });
    const superAdmin = new User({
      name: 'Super Admin',
      displayName: 'Super Admin',
      email: MAIN_EMAIL,
      password: await require('bcryptjs').hash('admin123@', 10),
      role: 'superadmin',
      isAdmin: true,
      isSuperAdmin: true,
      status: 'active'
    });
    await superAdmin.save();
    console.log('[✓] Đã làm sạch và giữ lại 1 Super Admin duy nhất.');

    // 2. Xóa tất cả các Admin "rác" khác (Toàn, Sub Admin, v.v.)
    const deletedAdmins = await User.deleteMany({ 
      isAdmin: true, 
      email: { $ne: MAIN_EMAIL } 
    });
    console.log(`[✓] Đã xóa ${deletedAdmins.deletedCount} tài khoản Admin rác.`);

    // 3. Tạo lại một vài tài khoản mẫu (Người dùng & Doanh nghiệp) để Dashboard không bị trống
    // Xóa hết các user/biz cũ để làm mới hoàn toàn nếu cần, hoặc cứ để lại nếu là tài khoản thật
    // Ở đây mình sẽ tạo mới cho bạn 2 cái chuẩn:
    const testUser = new User({
      name: 'Thành viên mẫu',
      email: 'member@test.com',
      password: await require('bcryptjs').hash('user123@', 10),
      role: 'user',
      isAdmin: false,
      isSuperAdmin: false,
      status: 'active'
    });
    const testBiz = new User({
      name: 'Doanh nghiệp mẫu',
      email: 'business@test.com',
      password: await require('bcryptjs').hash('biz123@', 10),
      role: 'business',
      isBusiness: true,
      isAdmin: false,
      isSuperAdmin: false,
      status: 'active'
    });

    await testUser.save();
    await testBiz.save();
    console.log('[✓] Đã khôi phục 1 tài khoản Người dùng và 1 tài khoản Doanh nghiệp mẫu.');

    console.log('\n✨ Xong! Bây giờ hệ thống chỉ còn 1 Super Admin và các tài khoản người dùng chuẩn.');
  } catch (err) {
    console.error('Lỗi khi sắp xếp:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

rebuildUsers();
