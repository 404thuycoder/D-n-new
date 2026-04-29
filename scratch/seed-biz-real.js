const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI.trim());
    console.log('Connected to MongoDB');
    
    // Model Definitions
    const BusinessAccount = mongoose.model('BusinessAccount', new mongoose.Schema({
      customId: String,
      name: String,
      displayName: String,
      email: { type: String, unique: true },
      password: { type: String },
      status: String
    }));

    const Place = mongoose.model('Place', new mongoose.Schema({ 
      id: String,
      ownerId: String, 
      name: String,
      status: String,
      kind: String,
      region: String,
      address: String,
      description: String,
      image: String,
      priceFrom: Number,
      ratingAvg: String,
      reviewCount: Number,
      favoritesCount: Number,
      reviews: Array
    }, { strict: false }));

    // 1. Create REAL Business Account in BusinessAccount collection
    const email = 'halong@luxury.com';
    let biz = await BusinessAccount.findOne({ email });
    if (!biz) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      biz = new BusinessAccount({
        customId: 'B-business-HL-777',
        name: 'Ha Long Luxury Hotel',
        displayName: 'Ha Long Luxury Hotel',
        email: email,
        password: hashedPassword,
        status: 'active'
      });
      await biz.save();
      console.log('Created REAL Business Account:', biz.email, 'ID:', biz.customId);
    } else {
      console.log('Business Account already exists:', biz.email);
    }

    // 2. Create Places with REAL ownerId
    const places = [
      {
        id: 'halong-deluxe-001',
        name: 'Phòng Deluxe Hướng Biển - Ha Long Luxury',
        kind: 'tien-ich',
        region: 'Hạ Long, Quảng Ninh',
        address: '88 Đường Hạ Long, Bãi Cháy',
        description: 'Phòng cao cấp với tầm nhìn trọn vẹn vịnh Hạ Long, đầy đủ tiện nghi 5 sao.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        priceFrom: 2500000,
        ratingAvg: '5.0',
        reviewCount: 2,
        favoritesCount: 156,
        status: 'approved',
        ownerId: biz.customId,
        reviews: [
          { userId: 'user123', userName: 'Nguyễn Văn A', rating: 5, text: 'Phòng rất đẹp và sạch sẽ!', createdAt: new Date() },
          { userId: 'user456', userName: 'Trần Thị B', rating: 5, text: 'Dịch vụ tuyệt vời, nhân viên nhiệt tình.', createdAt: new Date() }
        ]
      },
      {
        id: 'halong-tour-001',
        name: 'Tour Du Thuyền 5 Sao Khám Phá Vịnh',
        kind: 'diem-du-lich',
        region: 'Hạ Long, Quảng Ninh',
        address: 'Cảng tàu khách quốc tế Hạ Long',
        description: 'Hành trình 2 ngày 1 đêm trên du thuyền sang trọng, khám phá hang Sửng Sốt và đảo Ti Tốp.',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
        priceFrom: 3800000,
        ratingAvg: '4.8',
        reviewCount: 1,
        favoritesCount: 320,
        status: 'approved',
        ownerId: biz.customId,
        reviews: [
          { userId: 'user789', userName: 'Lê Văn C', rating: 4, text: 'Chuyến đi rất thú vị, cảnh đẹp tuyệt vời.', createdAt: new Date() }
        ]
      }
    ];

    for (const p of places) {
      await Place.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true });
    }
    console.log('Seeded', places.length, 'business services linked to REAL ID:', biz.customId);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
