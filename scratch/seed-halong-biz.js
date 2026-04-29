/**
 * SEED SERVICES FOR BIZ-001-HALONG
 * Tạo thêm nhiều tour và tiện ích đa dạng cho Ha Long Luxury Hotel
 */
const mongoose = require('mongoose');
require('dotenv').config();

const Place = require('../models/Place');

const BIZ_ID = 'BIZ-001-HALONG';
const REGION = 'Hạ Long, Quảng Ninh';

const services = [
  {
    id: 'halong-seaplane-001',
    name: 'Tour Thủy Phi Cơ Ngắm Vịnh Hạ Long',
    kind: 'diem-du-lich',
    region: REGION,
    address: 'Tuần Châu, Hạ Long',
    description: 'Trải nghiệm ngắm nhìn toàn cảnh kỳ quan thiên nhiên thế giới từ độ cao 300m trên thủy phi cơ hiện đại.',
    priceFrom: 2500000,
    priceTo: 3500000,
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    ownerId: BIZ_ID,
    status: 'approved',
    source: 'partner',
    verified: true,
    amenities: ['Hướng dẫn viên', 'Bảo hiểm', 'Nước uống'],
    highlights: ['Bay lượn trên các hòn đảo', 'Cất hạ cánh trên mặt nước', 'Góc nhìn Panorama']
  },
  {
    id: 'halong-sunworld-001',
    name: 'Vé Tổ Hợp Vui Chơi Sun World Ha Long',
    kind: 'tien-ich',
    region: REGION,
    address: 'Bãi Cháy, Hạ Long',
    description: 'Khám phá công viên rồng, công viên nước và cáp treo Nữ Hoàng đạt nhiều kỷ lục thế giới.',
    priceFrom: 350000,
    priceTo: 700000,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    ownerId: BIZ_ID,
    status: 'approved',
    source: 'partner',
    verified: true,
    amenities: ['Lối đi ưu tiên', 'Gửi đồ miễn phí'],
    highlights: ['Cáp treo Nữ Hoàng', 'Vòng quay Mặt Trời', 'Tàu lượn siêu tốc']
  },
  {
    id: 'halong-kayak-001',
    name: 'Tour Chèo Kayak Khám Phá Hang Luồn',
    kind: 'diem-du-lich',
    region: REGION,
    address: 'Hang Luồn, Vịnh Hạ Long',
    description: 'Tự tay chèo lái chiếc Kayak len lỏi qua những hang động kỳ bí và ngắm nhìn đàn khỉ hoang dã.',
    priceFrom: 150000,
    priceTo: 300000,
    image: 'https://images.unsplash.com/photo-1544551763-47a0159f9234?w=800',
    ownerId: BIZ_ID,
    status: 'approved',
    source: 'partner',
    verified: true,
    amenities: ['Dụng cụ bảo hộ', 'Kayak chuyên dụng'],
    highlights: ['Ngắm khỉ vàng', 'Hang động xuyên thủy', 'Check-in mặt nước']
  },
  {
    id: 'halong-dinner-001',
    name: 'Bữa Tối Lãng Mạn Trên Bãi Biển - Luxury Dinner',
    kind: 'tien-ich',
    region: REGION,
    address: 'Bãi biển riêng Ha Long Luxury',
    description: 'Thưởng thức hải sản cao cấp dưới ánh nến và tiếng sóng vỗ rì rào tại bãi biển riêng tư.',
    priceFrom: 1200000,
    priceTo: 2500000,
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800',
    ownerId: BIZ_ID,
    status: 'approved',
    source: 'partner',
    verified: true,
    amenities: ['Rượu vang', 'Nhạc không lời', 'Trang trí theo yêu cầu'],
    highlights: ['Hải sản tươi sống', 'Không gian riêng tư', 'Hoàng hôn trên biển']
  },
  {
    id: 'halong-squid-001',
    name: 'Trải Nghiệm Câu Mực Đêm Cùng Ngư Dân',
    kind: 'diem-du-lich',
    region: REGION,
    address: 'Vịnh Hạ Long',
    description: 'Trở thành ngư dân thực thụ với hoạt động câu mực đêm giữa biển khơi và thưởng thức chiến lợi phẩm ngay tại tàu.',
    priceFrom: 450000,
    priceTo: 600000,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    ownerId: BIZ_ID,
    status: 'approved',
    source: 'partner',
    verified: true,
    amenities: ['Cần câu chuyên nghiệp', 'Áo phao', 'Chế biến tại chỗ'],
    highlights: ['Trải nghiệm đời sống ngư dân', 'Thưởng thức mực tươi', 'Vịnh Hạ Long về đêm']
  },
  {
    id: 'halong-spa-001',
    name: 'Dịch Vụ Spa & Massage Đá Nóng Cao Cấp',
    kind: 'tien-ich',
    region: REGION,
    address: 'Tầng 5, Ha Long Luxury Hotel',
    description: 'Thư giãn tuyệt đối với liệu pháp massage đá nóng và tinh dầu thảo mộc thiên nhiên.',
    priceFrom: 600000,
    priceTo: 1500000,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
    ownerId: BIZ_ID,
    status: 'approved',
    source: 'partner',
    verified: true,
    amenities: ['Trà thảo mộc', 'Xông hơi miễn phí', 'Khăn ấm'],
    highlights: ['Kỹ thuật viên chuyên nghiệp', 'View biển trực diện', 'Tinh dầu organic']
  },
  {
    id: 'halong-mountain-001',
    name: 'Tour Leo Núi Bài Thơ Ngắm Toàn Cảnh Vịnh',
    kind: 'diem-du-lich',
    region: REGION,
    address: 'Phường Hòn Gai, Hạ Long',
    description: 'Chinh phục đỉnh núi Bài Thơ để phóng tầm mắt thu trọn vẻ đẹp hùng vĩ của Vịnh Hạ Long và thành phố.',
    priceFrom: 200000,
    priceTo: 400000,
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800',
    ownerId: BIZ_ID,
    status: 'approved',
    source: 'partner',
    verified: true,
    amenities: ['Gậy leo núi', 'Nước uống', 'Đồ ăn nhẹ'],
    highlights: ['Góc nhìn đẹp nhất Hạ Long', 'Di tích lịch sử', 'Không khí trong lành']
  }
];

async function seed() {
  console.log('🔄 Đang kết nối MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI.trim());
  console.log('✅ Đã kết nối.\n');

  console.log(`🚀 Đang tạo ${services.length} dịch vụ cho doanh nghiệp ${BIZ_ID}...`);
  
  for (const s of services) {
    await Place.findOneAndUpdate({ id: s.id }, s, { upsert: true, new: true });
    console.log(`  + Đã thêm/cập nhật: ${s.name}`);
  }

  console.log('\n✨ Hoàn tất! Tất cả dịch vụ đã được kích hoạt (Approved).');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
