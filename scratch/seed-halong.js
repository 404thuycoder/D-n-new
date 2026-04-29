const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wander-viet-v2';

const BusinessAccount = require('../models/BusinessAccount');
const Place = require('../models/Place');

const BIZ_EMAIL = 'halong@luxury.com';
const BIZ_PASS = 'halong2026';

const generateCustomId = (roleOrKind) => {
  let prefix = 'user';
  if (roleOrKind === 'business') prefix = 'business';
  else if (roleOrKind === 'admin' || roleOrKind === 'superadmin') prefix = 'admin';
  else if (roleOrKind === 'diem-du-lich' || roleOrKind === 'tour') prefix = 'tour';
  else if (roleOrKind === 'tien-ich' || roleOrKind === 'service') prefix = 'service';
  
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${randomNum}`;
};

async function seedBusiness() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const hashedPassword = await bcrypt.hash(BIZ_PASS, 10);
    const bizId = generateCustomId('business');

    const biz = new BusinessAccount({
      email: BIZ_EMAIL,
      password: hashedPassword,
      name: 'Hạ Long Luxury Cruise',
      displayName: 'Hạ Long Luxury Travel',
      customId: bizId,
      status: 'active'
    });

    await biz.save();
    console.log(`✅ Business created: ${BIZ_EMAIL} / ${BIZ_PASS} (ID: ${bizId})`);

    const tours = [
      {
        name: 'Du thuyền 5 sao Vịnh Hạ Long',
        kind: 'diem-du-lich',
        region: 'Quảng Ninh',
        address: 'Cảng Tuần Châu, Hạ Long',
        description: 'Trải nghiệm du thuyền sang trọng 2 ngày 1 đêm trên vịnh Hạ Long với dịch vụ đẳng cấp 5 sao.',
        priceFrom: 3500000,
        image: 'https://images.unsplash.com/photo-1559592443-7f87a79f6386?w=800',
        images: ['https://images.unsplash.com/photo-1559592443-7f87a79f6386?w=800', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800'],
        ownerId: bizId,
        status: 'approved',
        source: 'partner',
        verified: true
      },
      {
        name: 'Tour Kayak & Leo núi Đảo Ti Tốp',
        kind: 'diem-du-lich',
        region: 'Quảng Ninh',
        address: 'Vịnh Hạ Long',
        description: 'Hành trình năng động khám phá các hang động bằng kayak và chinh phục đỉnh Ti Tốp.',
        priceFrom: 1200000,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        ownerId: bizId,
        status: 'approved',
        source: 'partner',
        verified: true
      },
      {
        name: 'Dịch vụ Đưa đón Limousine Hà Nội - Hạ Long',
        kind: 'tien-ich',
        region: 'Miền Bắc',
        address: 'Hà Nội & Hạ Long',
        description: 'Xe Limousine đời mới, đón tận nơi tại Hà Nội và trả khách tại cảng Tuần Châu.',
        priceFrom: 300000,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
        ownerId: bizId,
        status: 'approved',
        source: 'partner',
        verified: true
      }
    ];

    for (const t of tours) {
      const p = new Place({
        ...t,
        id: generateCustomId(t.kind)
      });
      await p.save();
      console.log(`✅ Created ${t.kind}: ${t.name} (ID: ${p.id})`);
    }

    console.log('✨ Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedBusiness();
