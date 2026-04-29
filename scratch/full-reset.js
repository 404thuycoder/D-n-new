/**
 * FULL RESET & CLEAN SEED SCRIPT
 * Xóa toàn bộ dữ liệu cũ, tạo lại tài khoản và dịch vụ sạch, chính xác
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI.trim();

// ── Models ─────────────────────────────────────────────────────────────────
const BusinessAccount = require('../models/BusinessAccount');
const Place           = require('../models/Place');
const User            = require('../models/User');
const AdminAccount    = require('../models/AdminAccount');

// Try to load optional models (may not exist)
let Booking, Feedback, BusinessMessage, Conversation, Itinerary;
try { Booking         = require('../models/Booking'); } catch(e) {}
try { Feedback        = require('../models/Feedback'); } catch(e) {}
try { BusinessMessage = require('../models/BusinessMessage'); } catch(e) {}
try { Conversation    = require('../models/Conversation'); } catch(e) {}
try { Itinerary       = require('../models/Itinerary'); } catch(e) {}

async function hardReset() {
  console.log('\n🔄 Đang kết nối MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Kết nối thành công\n');

  // ── 1. XÓA TOÀN BỘ DỮ LIỆU CŨ ────────────────────────────────────────
  console.log('🗑️  Đang xóa dữ liệu cũ...');

  const dels = await Promise.allSettled([
    BusinessAccount.deleteMany({}),
    Place.deleteMany({ source: 'partner' }),      // Chỉ xóa dữ liệu partner (giữ system places)
    User.deleteMany({ role: { $ne: 'superadmin' } }), // Giữ superadmin nếu có
    ...(Booking         ? [Booking.deleteMany({})]         : []),
    ...(Feedback        ? [Feedback.deleteMany({})]        : []),
    ...(BusinessMessage ? [BusinessMessage.deleteMany({})] : []),
    ...(Conversation    ? [Conversation.deleteMany({})]    : []),
    ...(Itinerary       ? [Itinerary.deleteMany({})]       : []),
  ]);

  dels.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      const label = ['BusinessAccount','Place(partner)','User','Booking','Feedback','BusinessMessage','Conversation','Itinerary'][i];
      console.log(`  ✓ ${label}: đã xóa ${r.value?.deletedCount || 0} bản ghi`);
    }
  });

  // ── 2. TẠO TÀI KHOẢN DOANH NGHIỆP THẬT ───────────────────────────────
  console.log('\n👔 Tạo tài khoản doanh nghiệp...');
  const bizPass = await bcrypt.hash('123456', 10);

  const biz = await BusinessAccount.create({
    customId:    'BIZ-001-HALONG',
    name:        'Ha Long Luxury Hotel',
    displayName: 'Ha Long Luxury Hotel',
    email:       'halong@luxury.com',
    password:    bizPass,
    status:      'active',
    points:      1500   // PLATINUM tier
  });
  console.log(`  ✓ Business: ${biz.email}  |  ID: ${biz.customId}`);

  // ── 3. TẠO DỊCH VỤ THẬT GẮN VỚI DOANH NGHIỆP ────────────────────────
  console.log('\n📦 Tạo dịch vụ partner...');

  const services = [
    {
      id:          'biz-halong-hotel-001',
      name:        'Phòng Deluxe Hướng Biển - Ha Long Luxury',
      kind:        'tien-ich',
      region:      'Hạ Long, Quảng Ninh',
      address:     '88 Đường Hạ Long, Bãi Cháy, Hạ Long',
      description: 'Phòng Deluxe sang trọng với tầm nhìn trọn vẹn vịnh Hạ Long. Đầy đủ tiện nghi 5 sao, bể bơi vô cực, spa và nhà hàng hải sản cao cấp.',
      image:       'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      images:      ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'],
      priceFrom:   2500000,
      priceTo:     4500000,
      ratingAvg:   '4.9',
      reviewCount: 3,
      favoritesCount: 156,
      highlights:  ['Tầm nhìn vịnh Hạ Long','Bể bơi vô cực','Bữa sáng miễn phí','Spa & Gym 24/7'],
      amenities:   ['WiFi miễn phí','Điều hòa','TV 4K','Két an toàn','Minibar'],
      contactPhone:'0203 620 000',
      contactEmail:'booking@halonghotel.com',
      openTime:    '24/7',
      status:      'approved',
      source:      'partner',
      verified:    true,
      ownerId:     biz.customId,
      lat:         20.9517,
      lng:         107.0680,
      reviews: [
        { userId:'user-test-01', userName:'Nguyễn Minh Tuấn', rating:5, text:'Khách sạn tuyệt vời! View vịnh đẹp không thể tả, nhân viên nhiệt tình.', createdAt: new Date('2024-04-01') },
        { userId:'user-test-02', userName:'Trần Thị Lan',     rating:5, text:'Phòng sạch, rộng, dịch vụ 5 sao thực sự. Bể bơi rất đẹp!',           createdAt: new Date('2024-04-10') },
        { userId:'user-test-03', userName:'Phạm Văn Đức',     rating:4, text:'Giá hơi cao nhưng xứng đáng. Bữa sáng ngon.',                        createdAt: new Date('2024-04-15') }
      ]
    },
    {
      id:          'biz-halong-tour-001',
      name:        'Tour Du Thuyền 5 Sao Khám Phá Vịnh Hạ Long',
      kind:        'diem-du-lich',
      region:      'Hạ Long, Quảng Ninh',
      address:     'Cảng tàu khách quốc tế Hạ Long, Bãi Cháy',
      description: 'Hành trình 2 ngày 1 đêm trên du thuyền 5 sao, khám phá hang Sửng Sốt, đảo Ti Tốp, chèo kayak và tắm biển. Bữa ăn hải sản tươi sống cao cấp.',
      image:       'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
      images:      ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80'],
      priceFrom:   3800000,
      priceTo:     5200000,
      ratingAvg:   '4.8',
      reviewCount: 1,
      favoritesCount: 320,
      highlights:  ['2N1Đ trên du thuyền 5 sao','Khám phá 3 hang động','Chèo kayak','Hải sản tươi sống'],
      amenities:   ['Phòng cabin riêng','Bữa ăn 3 bữa','Hướng dẫn viên','Cano đưa đón'],
      contactPhone:'0203 620 001',
      contactEmail:'tour@halonghotel.com',
      openTime:    '08:00',
      closeTime:   '08:00',
      openDays:    'Thứ 2 - Chủ nhật',
      status:      'approved',
      source:      'partner',
      verified:    true,
      ownerId:     biz.customId,
      lat:         20.9101,
      lng:         107.1839,
      reviews: [
        { userId:'user-test-04', userName:'Lê Thị Hoa', rating:5, text:'Chuyến đi tuyệt vời! Cảnh đẹp, đồ ăn ngon. Sẽ quay lại.', createdAt: new Date('2024-04-20') }
      ]
    }
  ];

  for (const svc of services) {
    await Place.create(svc);
    console.log(`  ✓ Service: ${svc.name}  [${svc.kind}]  ownerId: ${svc.ownerId}`);
  }

  // ── 4. TẠO TÀI KHOẢN USER THỬ NGHIỆM ────────────────────────────────
  console.log('\n👤 Tạo tài khoản người dùng...');
  const userPass = await bcrypt.hash('123456', 10);

  const testUser = await User.create({
    customId:    'USER-TEST-001',
    name:        'Người Dùng Test',
    displayName: 'Người Dùng Test',
    email:       'user@test.com',
    password:    userPass,
    role:        'user',
    status:      'active',
    points:      250
  });
  console.log(`  ✓ User: ${testUser.email}  |  ID: ${testUser.customId}`);

  // ── 5. KIỂM TRA KẾT QUẢ ──────────────────────────────────────────────
  console.log('\n📊 Kiểm tra kết quả:');
  const bizCount   = await BusinessAccount.countDocuments();
  const placeCount = await Place.countDocuments({ source: 'partner', status: 'approved' });
  const userCount  = await User.countDocuments();

  console.log(`  • BusinessAccount: ${bizCount}`);
  console.log(`  • Place (partner, approved): ${placeCount}`);
  console.log(`  • User: ${userCount}`);

  console.log('\n✅ Reset & Seed hoàn thành!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏢 TRANG DOANH NGHIỆP (localhost:3002)');
  console.log('   Email   : halong@luxury.com');
  console.log('   Mật khẩu: 123456');
  console.log('');
  console.log('👤 TRANG NGƯỜI DÙNG (localhost:3000)');
  console.log('   Email   : user@test.com');
  console.log('   Mật khẩu: 123456');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

hardReset().catch(err => {
  console.error('\n❌ Lỗi:', err.message);
  process.exit(1);
});
