const businessData = [
  {
    id: 1,
    name: 'InterContinental Đà Nẵng Sun Peninsula Resort',
    location: 'Bán đảo Sơn Trà, Đà Nẵng',
    price: 12500000,
    rating: 4.9,
    reviews: 1240,
    category: 'Khách sạn',
    rank: 'Diamond',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    description: 'Khu nghỉ dưỡng sang trọng bậc nhất thế giới với thiết kế mang đậm bản sắc văn hóa Việt Nam.'
  },
  {
    id: 2,
    name: 'Vinpearl Resort & Golf Nam Hội An',
    location: 'Bình Minh, Quảng Nam',
    price: 3200000,
    rating: 4.7,
    reviews: 850,
    category: 'Khách sạn',
    rank: 'Platinum',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    description: 'Tổ hợp nghỉ dưỡng, vui chơi giải trí và golf đẳng cấp bên bờ biển Bình Minh thơ mộng.'
  },
  {
    id: 3,
    name: 'Tour Du Thuyền Hạ Long 5 Sao',
    location: 'Vịnh Hạ Long, Quảng Ninh',
    price: 4500000,
    rating: 4.8,
    reviews: 520,
    category: 'Tour du lịch',
    rank: 'Platinum',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
    description: 'Trải nghiệm ngủ đêm trên vịnh di sản với dịch vụ đẳng cấp và ẩm thực tinh tế.'
  },
  {
    id: 4,
    name: 'Nhà Hàng Ngon - Hà Nội',
    location: 'Hoàn Kiếm, Hà Nội',
    price: 450000,
    rating: 4.5,
    reviews: 2100,
    category: 'Ẩm thực',
    rank: 'Gold',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    description: 'Nơi hội tụ tinh hoa ẩm thực ba miền trong không gian biệt thự Pháp cổ kính.'
  },
  {
    id: 5,
    name: 'Mường Thanh Luxury Cần Thơ',
    location: 'Cái Khế, Cần Thơ',
    price: 1350000,
    rating: 4.3,
    reviews: 420,
    category: 'Khách sạn',
    rank: 'Gold',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    description: 'Khách sạn 5 sao đầu tiên tại Đồng bằng sông Cửu Long với tầm nhìn hướng sông Hậu.'
  },
  {
    id: 6,
    name: 'Tour Chinh Phục Đỉnh Fansipan',
    location: 'Sa Pa, Lào Cai',
    price: 1890000,
    rating: 4.8,
    reviews: 760,
    category: 'Tour du lịch',
    rank: 'Platinum',
    image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80',
    description: 'Hành trình chinh phục nóc nhà Đông Dương bằng hệ thống cáp treo hiện đại nhất.'
  },
  {
    id: 7,
    name: 'Six Senses Ninh Van Bay',
    location: 'Vịnh Ninh Vân, Nha Trang',
    price: 18000000,
    rating: 5.0,
    reviews: 310,
    category: 'Khách sạn',
    rank: 'Diamond',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    description: 'Khu nghỉ dưỡng biệt lập hoàn toàn giữa thiên nhiên hoang sơ của vịnh Ninh Vân.'
  },
  {
    id: 8,
    name: 'Pizza 4P\'s Ben Thanh',
    location: 'Quận 1, TP. Hồ Chí Minh',
    price: 350000,
    rating: 4.7,
    reviews: 3500,
    category: 'Ẩm thực',
    rank: 'Gold',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    description: 'Trải nghiệm ẩm thực Ý kết hợp phong cách Nhật Bản với phô mai thủ công trứ danh.'
  },
  {
    id: 9,
    name: 'Pullman Vũng Tàu',
    location: 'Vũng Tàu, Bà Rịa - Vũng Tàu',
    price: 2450000,
    rating: 4.4,
    reviews: 980,
    category: 'Khách sạn',
    rank: 'Platinum',
    image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80',
    description: 'Khách sạn tiêu chuẩn quốc tế với thiết kế hiện đại và hồ bơi vô cực ấn tượng.'
  },
  {
    id: 10,
    name: 'Sun World Ba Na Hills',
    location: 'Hòa Vang, Đà Nẵng',
    price: 850000,
    rating: 4.8,
    reviews: 5400,
    category: 'Giải trí',
    rank: 'Diamond',
    image: 'https://images.unsplash.com/photo-1710900906700-6723be0fbd80?w=800&q=80',
    description: 'Công viên chủ đề hàng đầu Việt Nam với Cầu Vàng biểu tượng và làng Pháp cổ điển.'
  }
];

if (typeof module !== 'undefined') {
  module.exports = businessData;
}
