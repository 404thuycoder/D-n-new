"use strict";

/**
 * Dữ liệu điểm đến — WanderViệt (fallback phía client khi MongoDB không khả dụng)
 * Nguồn: Được lấy từ các cổng TTĐT và trang du lịch chính thống của Việt Nam
 * budget: 1=tiết kiệm, 2=vừa phải, 3=cao cấp | pace: cham|vua|nhanh
 */
window.WANDER_PLACES = [{
  id: "phu-quoc",
  name: "Phú Quốc",
  region: "Kiên Giang",
  tags: ["biển", "ẩm thực", "nghỉ dưỡng"],
  budget: 3,
  pace: "vua",
  habits: ["gia đình", "cặp đôi", "đi sớm"],
  interests: ["biển", "resort", "hải sản", "chụp ảnh"],
  meta: "Biển xanh, hoàng hôn & hải sản tươi",
  top: true,
  verified: true,
  text: "Đảo ngọc Phú Quốc với dải cát trắng mịn, resort cao cấp trải dài, hệ sinh thái biển đa dạng cùng chợ đêm sầm uất và làng chài truyền thống.",
  image: "assets/img/phu-quoc.png",
  lat: 10.2899,
  lng: 103.984,
  transportTips: "Đặt vé bay thẳng đến Phú Quốc. Trong đảo thuê xe máy hoặc xe điện VinBus để dạo quanh.",
  activities: [{
    dayPart: "Sáng",
    title: "Bãi Sao / Bãi Khem",
    tip: "Đi sớm tránh nắng; dùng kem chống nắng thân thiện san hô."
  }, {
    dayPart: "Chiều",
    title: "Lặn biển ngắm san hô",
    tip: "Đặt tour ghép có hướng dẫn viên để an toàn."
  }, {
    dayPart: "Tối",
    title: "Chợ đêm Dinh Cậu",
    tip: "Hỏi giá trước khi gọi món hải sản."
  }],
  amusementPlaces: [{
    name: "VinWonders Phú Quốc",
    image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80",
    rating: 4.8,
    description: "Công viên chủ đề lớn nhất Việt Nam với hơn 100 trò chơi hấp dẫn, khu vui chơi thế giới nước và thủy cung sứa vô cùng ấn tượng.",
    ticketPrice: "950,000 VND",
    openingHours: "09:00 - 19:30",
    address: "Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang"
  }, {
    name: "Sun World Hòn Thơm",
    image: "https://images.unsplash.com/photo-1544971587-b842c27f8e14?w=400&q=80",
    rating: 4.9,
    description: "Khu du lịch sinh thái bao gồm cáp treo vượt biển dài nhất thế giới, công viên nước Aquatopia và nhiều bãi biển đẹp tuyệt vời.",
    ticketPrice: "600,000 VND (Cáp khứ hồi)",
    openingHours: "09:00 - 17:00",
    address: "Bãi Đất Đỏ, An Thới, Phú Quốc, Kiên Giang"
  }, {
    name: "Grand World Phú Quốc",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
    rating: 4.6,
    description: "Thành phố không ngủ lấy cảm hứng từ các thành phố Châu Âu, có sông Venice, khu chợ đêm và các show diễn hoành tráng.",
    ticketPrice: "Vào cửa Miễn phí",
    openingHours: "24/24",
    address: "Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang"
  }],
  accommodations: [{
    name: "JW Marriott Phu Quoc Resort",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.9,
    description: "Kiến trúc độc đáo tại Bãi Khem.",
    priceRange: "8M - 15M VND",
    address: "An Thới, Phú Quốc"
  }],
  diningPlaces: [{
    name: "Nhà hàng Xin Chào",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.5,
    description: "Nhà hàng view biển trung tâm.",
    priceRange: "300k - 1M VND",
    address: "Dương Đông, Phú Quốc"
  }],
  checkInSpots: [{
    name: "Sunset Sanato Beach Club",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    rating: 4.7,
    description: "Điểm check-in hoàng hôn nổi tiếng.",
    address: "Dương Tơ, Phú Quốc"
  }],
  sourceName: "Cổng TTĐT Tỉnh Kiên Giang",
  sourceUrl: "https://kiengiang.gov.vn/"
}, {
  id: "hoi-an",
  name: "Hội An",
  region: "Quảng Nam",
  tags: ["văn hóa", "ẩm thực"],
  budget: 2,
  pace: "cham",
  habits: ["cặp đôi", "đi một mình", "cú đêm"],
  interests: ["phố cổ", "ẩm thực", "làng nghề", "UNESCO"],
  meta: "Phố cổ đèn lồng & Di sản văn hóa UNESCO",
  top: true,
  verified: true,
  text: "Hội An là di sản văn hóa thế giới UNESCO, đặc trưng bởi những nếp nhà cổ kính sơn vàng và sông Hoài lấp lánh hoa đăng về đêm.",
  image: "assets/img/hoi-an.png",
  lat: 15.8801,
  lng: 108.338,
  transportTips: "Bay đến Đà Nẵng, di chuyển bằng taxi ~45 phút. Trong phố cổ đi bộ hoặc thuê xe đạp.",
  activities: [{
    dayPart: "Sáng",
    title: "Cao lầu Phố Hội & Hẻm cà phê sắc màu",
    tip: "Cao lầu ngon nhất được nấu từ nước giếng cổ Bá Lễ."
  }, {
    dayPart: "Chiều",
    title: "Rừng dừa Cẩm Thanh – đi thúng chai",
    tip: "Chuẩn bị mũ nón vì khu vực thường nắng gắt."
  }, {
    dayPart: "Tối",
    title: "Thả hoa đăng trên sông Hoài",
    tip: "Rất đông cuối tuần; cẩn thận tư trang."
  }],
  amusementPlaces: [{
    name: "VinWonders Nam Hội An",
    image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80",
    rating: 4.7,
    description: "River Safari - Đi thuyền ngắm động vật hoang dã và Công viên Văn hóa.",
    ticketPrice: "600,000 VND",
    openingHours: "09:00 - 20:00",
    address: "Bình Minh, Thăng Bình, Quảng Nam"
  }, {
    name: "Ký ức Hội An (Hoian Memories Land)",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
    rating: 4.9,
    description: "Show diễn thực cảnh hoành tráng tái hiện lịch sử giao thương xưa.",
    ticketPrice: "600,000 VND (Vé show)",
    openingHours: "17:00 - 22:00",
    address: "Cẩm Nam, Hội An"
  }],
  accommodations: [{
    name: "Anantara Hoi An Resort",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.8,
    description: "Nghỉ dưỡng sang trọng bên sông Thu Bồn.",
    priceRange: "5M - 10M VND",
    address: "Cẩm Châu, Hội An"
  }],
  diningPlaces: [{
    name: "Bánh mì Phượng",
    image: "https://images.unsplash.com/photo-1509722747041-074f18d68246?w=400&q=80",
    rating: 4.6,
    description: "Tiệm bánh mì trứ danh thế giới.",
    priceRange: "20k - 40k VND",
    address: "2B Phan Chu Trinh, Hội An"
  }],
  checkInSpots: [{
    name: "Chùa Cầu (Japanese Bridge)",
    image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=400&q=80",
    rating: 4.8,
    description: "Biểu tượng lịch sử Phố cổ.",
    address: "Nguyễn Thị Minh Khai, Hội An"
  }],
  sourceName: "Quỹ Di sản Hội An",
  sourceUrl: "https://disanhoian.vn/"
}, {
  id: "sa-pa",
  name: "Sa Pa",
  region: "Lào Cai",
  tags: ["leo núi", "văn hóa", "ẩm thực"],
  budget: 2,
  pace: "nhanh",
  habits: ["đi một mình", "gia đình", "đi sớm"],
  interests: ["trekking", "bản làng", "ruộng bậc thang", "check-in"],
  meta: "Thiên đường mây & Ruộng bậc thang kỳ vĩ",
  top: true,
  verified: true,
  text: "Sa Pa chinh phục mọi du khách với đỉnh Fansipan hùng vĩ, ruộng bậc thang uốn lượn và bản sắc văn hóa dân tộc rực rỡ sắc màu Tây Bắc.",
  image: "assets/img/sa-pa.png",
  lat: 22.3364,
  lng: 103.8438,
  transportTips: "Xe giường nằm hoặc tàu đêm từ Hà Nội (6-8h). Sa Pa lạnh quanh năm — luôn mang áo ấm.",
  activities: [{
    dayPart: "Sáng",
    title: "Chinh phục Fansipan bằng cáp treo",
    tip: "Đi lúc 8h để săn mây; mang áo ấm dù là mùa hè."
  }, {
    dayPart: "Chiều",
    title: "Trekking Bản Cát Cát / Tả Van",
    tip: "Giày trekking chống trượt; đường bản thường dốc và bùn."
  }, {
    dayPart: "Tối",
    title: "Lẩu cá tầm & Rượu táo mèo",
    tip: "Cá mú, lẩu gà đen là đặc sản tuyệt vời giữa trời lạnh."
  }],
  amusementPlaces: [{
    name: "Sun World Fansipan Legend",
    image: "https://images.unsplash.com/photo-1544971587-b842c27f8e14?w=400&q=80",
    rating: 4.9,
    description: "Hệ thống cáp treo đạt kỷ lục Guinness giúp chinh phục đỉnh Fansipan nhanh chóng.",
    ticketPrice: "800,000 VND",
    openingHours: "08:00 - 17:00",
    address: "Hoàng Liên, Sa Pa"
  }, {
    name: "Bản Cát Cát",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80",
    rating: 4.5,
    description: "Ngôi làng cổ rực rỡ nghề truyền thống và thác nước trắng xóa.",
    ticketPrice: "150,000 VND",
    openingHours: "06:00 - 18:00",
    address: "San Sả Hồ, Sa Pa"
  }],
  accommodations: [{
    name: "Hotel de la Coupole - MGallery",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.9,
    description: "Kiệt tác kiến trúc Pháp - Tây Bắc.",
    priceRange: "3.5M - 7M VND",
    address: "1 Hoàng Liên, Sa Pa"
  }],
  diningPlaces: [{
    name: "Nhà hàng A Phủ",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.5,
    description: "Đặc sản gà nướng tiêu xanh vùng cao.",
    priceRange: "150k - 400k VND",
    address: "15 Fansipan, Sa Pa"
  }],
  checkInSpots: [{
    name: "Đèo Ô Quy Hồ",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
    rating: 4.9,
    description: "Một trong tứ đại đỉnh đèo Việt Nam.",
    address: "Lào Cai - Lai Châu"
  }],
  sourceName: "Cổng Du lịch Lào Cai",
  sourceUrl: "https://laocaitourism.vn/"
}, {
  id: "ha-long",
  name: "Vịnh Hạ Long",
  region: "Quảng Ninh",
  tags: ["biển", "văn hóa", "nghỉ dưỡng"],
  budget: 3,
  pace: "vua",
  habits: ["cặp đôi", "gia đình"],
  interests: ["du thuyền", "kayak", "UNESCO", "check-in"],
  meta: "Kỳ quan thiên nhiên thế giới 2 lần UNESCO",
  top: true,
  text: "Hàng nghìn đảo đá vôi sừng sững giữa làn nước ngọc bích — Vịnh Hạ Long là Di sản Thiên nhiên Thế giới và biểu tượng du lịch Việt Nam.",
  image: "assets/img/ha-long.png",
  lat: 20.9101,
  lng: 107.1839,
  transportTips: "Cao tốc Hà Nội–Quảng Ninh rút ngắn còn 2-2.5 giờ. Nên đặt tour du thuyền 1-3 đêm.",
  activities: [{
    dayPart: "Sáng",
    title: "Khám phá Hang Sửng Sốt / Động Thiên Cung",
    tip: "Đặt tham quan theo giờ; tránh đông người buổi trưa."
  }, {
    dayPart: "Chiều",
    title: "Kayak hang Luồn & Tùng Áng",
    tip: "Mặc áo phao đúng cách; cẩn thận với khỉ hoang trên vách đá."
  }, {
    dayPart: "Tối",
    title: "Bữa tối hải sản & Câu mực đêm trên boong",
    tip: "Du thuyền đêm là trải nghiệm không thể quên trên Vịnh."
  }],
  amusementPlaces: [{
    name: "Sun World Ha Long",
    image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80",
    rating: 4.8,
    description: "Tổ hợp giải trí với vòng quay Mặt trời khổng lồ.",
    ticketPrice: "350k - 700k VND",
    openingHours: "09:00 - 22:00",
    address: "Bãi Cháy, Hạ Long"
  }],
  accommodations: [{
    name: "Vinpearl Resort & Spa Ha Long",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.7,
    description: "Nghỉ dưỡng biệt lập trên đảo Rều.",
    priceRange: "3M - 6M VND",
    address: "Đảo Rều, Bãi Cháy"
  }],
  diningPlaces: [{
    name: "Nhà hàng Hồng Hạnh 3",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.6,
    description: "Hải sản tươi ngon nổi tiếng Hạ Long.",
    priceRange: "400k - 1.2M VND",
    address: "Bãi Cháy, Hạ Long"
  }],
  checkInSpots: [{
    name: "Bảo tàng Quảng Ninh",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
    rating: 4.7,
    description: "Kiến trúc 'viên ngọc đen' độc đáo.",
    address: "Hồng Gai, Hạ Long"
  }],
  sourceName: "Ban Quản lý Vịnh Hạ Long",
  sourceUrl: "https://halong.org.vn/"
}, {
  id: "ha-noi",
  name: "Hà Nội",
  region: "Thủ đô",
  tags: ["ẩm thực", "văn hóa"],
  budget: 1,
  pace: "cham",
  habits: ["cú đêm", "đi một mình", "cặp đôi"],
  interests: ["phố cổ", "cà phê", "bảo tàng", "ẩm thực đường phố"],
  meta: "Thủ đô nghìn năm văn hiến & Ẩm thực đường phố",
  top: false,
  text: "Hà Nội pha trộn lịch sử nghìn năm với nhịp sống hiện đại, nổi danh toàn cầu bởi phở, bún chả và cà phê trứng độc đáo.",
  image: "assets/img/ha-noi.png",
  lat: 21.0285,
  lng: 105.8542,
  transportTips: "Dùng Grab hoặc xe ôm app. Phố cổ nên đi bộ; tránh giờ cao điểm 7-9h và 17-19h.",
  activities: [{
    dayPart: "Sáng",
    title: "Văn Miếu - Quốc Tử Giám",
    tip: "Đến sớm trước 8h để không gian vắng và đẹp cho ảnh."
  }, {
    dayPart: "Chiều",
    title: "Cà phê Trứng phố Đinh Tiên Hoàng",
    tip: "Cà phê Giang nổi tiếng nhất; ngồi tầng 2 ngắm phố cổ."
  }, {
    dayPart: "Tối",
    title: "Bia hơi vỉa hè tại Tạ Hiện",
    tip: "Nhộn nhịp đến 1h sáng. Giữ tư trang cá nhân cẩn thận."
  }],
  amusementPlaces: [{
    name: "VinKE & Vinpearl Aquarium",
    image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80",
    rating: 4.6,
    description: "Thủy cung lớn nhất Hà Nội tại Times City.",
    ticketPrice: "170k - 250k VND",
    openingHours: "10:00 - 22:00",
    address: "458 Minh Khai, Hà Nội"
  }],
  accommodations: [{
    name: "Sofitel Legend Metropole",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.9,
    description: "Khách sạn cổ điển lịch sử 100 năm.",
    priceRange: "6M - 15M VND",
    address: "15 Ngô Quyền, Hà Nội"
  }],
  diningPlaces: [{
    name: "Phở Thìn Lò Đúc",
    image: "https://images.unsplash.com/photo-1509722747041-074f18d68246?w=400&q=80",
    rating: 4.4,
    description: "Phở tái lăn trứ danh Hà Nội.",
    priceRange: "60k - 100k VND",
    address: "13 Lò Đúc, Hà Nội"
  }],
  checkInSpots: [{
    name: "Nhà Thờ Lớn Hà Nội",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
    rating: 4.7,
    description: "Kiến trúc Gothic cổ điển trung tâm.",
    address: "40 Nhà Chung, Hà Nội"
  }],
  sourceName: "Vietnam.Travel - Cục Du lịch Quốc gia",
  sourceUrl: "https://vietnam.travel/places-to-go/northern-vietnam/ha-noi"
}, {
  id: "da-lat",
  name: "Đà Lạt",
  region: "Lâm Đồng",
  tags: ["leo núi", "ẩm thực", "nghỉ dưỡng"],
  budget: 2,
  pace: "cham",
  habits: ["cặp đôi", "gia đình"],
  interests: ["hoa", "cà phê", "thiên nhiên", "check-in"],
  meta: "Thành phố ngàn hoa & Khí hậu mát mẻ quanh năm",
  top: true,
  text: "Đà Lạt trên cao nguyên Langbiang nổi tiếng với vườn hoa bát ngát, đồi chè xanh mướt, kiến trúc Pháp cổ điển và cà phê specialty.",
  image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&q=80",
  lat: 11.9404,
  lng: 108.4583,
  transportTips: "Xe giường nằm từ TP.HCM (6-7h) hoặc bay đến sân bay Liên Khương. Đà Lạt dốc — thuê xe máy cần kinh nghiệm.",
  activities: [{
    dayPart: "Sáng",
    title: "Đồi chè Cầu Đất & Vườn dâu tây",
    tip: "Mang áo khoác dù mùa hè; sương tan lúc 8-9h."
  }, {
    dayPart: "Chiều",
    title: "Hồ Tuyền Lâm — đạp xe / kayak",
    tip: "Đường quanh hồ rất đẹp và an toàn cho xe đạp."
  }, {
    dayPart: "Tối",
    title: "Chợ đêm Đà Lạt & ăn vặt đặc sản",
    tip: "Kem bơ, bánh tráng nướng, sữa đậu nành — giá rẻ và ngon."
  }],
  accommodations: [{
    name: "Ana Mandara Villas Dalat",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.8,
    description: "Biệt thự Pháp cổ giữa rừng thông.",
    priceRange: "2.5M - 5M VND",
    address: "Lê Lai, Đà Lạt"
  }],
  diningPlaces: [{
    name: "Lẩu gà lá é Tao Ngộ",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.5,
    description: "Món lẩu đặc trưng không thể bỏ qua.",
    priceRange: "200k - 400k VND",
    address: "05 Đường 3/4, Đà Lạt"
  }],
  checkInSpots: [{
    name: "Quảng trường Lâm Viên",
    image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=400&q=80",
    rating: 4.6,
    description: "Biểu tượng nụ hoa Atiso khổng lồ.",
    address: "Trần Quốc Toản, Đà Lạt"
  }],
  sourceName: "Cổng Du lịch Lâm Đồng",
  sourceUrl: "https://lamdong.gov.vn/Sites/vi-vn/Pages/default.aspx"
}, {
  id: "da-nang",
  name: "Đà Nẵng",
  region: "Đà Nẵng",
  tags: ["biển", "ẩm thực", "văn hóa"],
  budget: 2,
  pace: "vua",
  habits: ["gia đình", "cặp đôi"],
  interests: ["biển", "cầu Vàng", "ẩm thực", "resort"],
  meta: "Thành phố đáng sống & Biển Mỹ Khê tuyệt đẹp",
  top: false,
  text: "Đà Nẵng được mệnh danh thành phố đáng sống nhất Việt Nam với biển Mỹ Khê trong xanh, Bà Nà Hills kỳ thú và Cầu Vàng nổi tiếng thế giới.",
  image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80",
  lat: 16.0544,
  lng: 108.2022,
  transportTips: "Sân bay Quốc tế Đà Nẵng cách trung tâm 5-10 phút. Thuê xe máy hoặc dùng Grab.",
  activities: [{
    dayPart: "Sáng",
    title: "Tắm biển Mỹ Khê / Ngũ Hành Sơn",
    tip: "Nắng mạnh 10h-14h — bôi kem chống nắng kỹ."
  }, {
    dayPart: "Chiều",
    title: "Bà Nà Hills & Cầu Vàng (Golden Bridge)",
    tip: "Trên đỉnh mát hơn 8-10°C; mang áo khoác nhẹ."
  }, {
    dayPart: "Tối",
    title: "Cầu Rồng phun lửa & Chợ Hàn",
    tip: "Cầu phun lửa lúc 21h thứ 7 & CN. Đến trước 30p."
  }],
  amusementPlaces: [{
    name: "Sun World Ba Na Hills",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80",
    rating: 4.9,
    description: "Ngôi làng Pháp cổ kính và Cầu Vàng.",
    ticketPrice: "900,000 VND",
    openingHours: "08:00 - 22:00",
    address: "Hòa Vang, Đà Nẵng"
  }],
  accommodations: [{
    name: "InterContinental Danang",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 5.0,
    description: "Resort sang trọng bậc nhất Sơn Trà.",
    priceRange: "12M - 25M VND",
    address: "Sơn Trà, Đà Nẵng"
  }],
  diningPlaces: [{
    name: "Mì Quảng Bà Mua",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    rating: 4.5,
    description: "Mì Quảng gia truyền nổi tiếng.",
    priceRange: "40k - 80k VND",
    address: "95A Nguyễn Tri Phương"
  }],
  checkInSpots: [{
    name: "Cầu Vàng",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80",
    rating: 4.9,
    description: "Biểu tượng du lịch mới của Đà Nẵng.",
    address: "Sun World Ba Na Hills"
  }],
  sourceName: "Cổng Thông tin Du lịch Đà Nẵng",
  sourceUrl: "https://danangfantasticity.com/"
}, {
  id: "nha-trang",
  name: "Nha Trang",
  region: "Khánh Hòa",
  tags: ["biển", "ẩm thực"],
  budget: 2,
  pace: "vua",
  habits: ["cặp đôi", "gia đình", "cú đêm"],
  interests: ["lặn", "đảo", "resort", "ẩm thực"],
  meta: "Thành phố biển & San hô đa dạng nhất Việt Nam",
  top: false,
  text: "Nha Trang sở hữu vùng biển trong xanh với hệ thống rạn san hô phong phú, chuỗi đảo hoang sơ và ẩm thực biển cực kỳ đặc sắc.",
  image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
  lat: 12.2388,
  lng: 109.1967,
  transportTips: "Bay đến sân bay Cam Ranh, shuttle/bus vào trung tâm (~45 phút). Chú ý cờ an toàn khi tắm biển.",
  activities: [{
    dayPart: "Sáng",
    title: "Tháp Bà Ponagar cổ kính nghìn năm",
    tip: "Đi sớm; váy ngắn cần sarong khi vào khu thánh tích."
  }, {
    dayPart: "Chiều",
    title: "Tour 4 đảo hoặc VinWonders Nha Trang",
    tip: "Đặt online có giá tốt hơn; kiểm tra thời tiết biển."
  }, {
    dayPart: "Tối",
    title: "Hải sản tươi sống đường biển Trần Phú",
    tip: "Hỏi giá /kg trước; bạch tuộc, ghẹ, tôm hùm là đặc sản."
  }],
  amusementPlaces: [{
    name: "VinWonders Nha Trang",
    image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80",
    rating: 4.8,
    description: "Công viên giải trí trên đảo Hòn Tre.",
    ticketPrice: "800,000 VND",
    openingHours: "08:00 - 20:00",
    address: "Đảo Hòn Tre, Nha Trang"
  }],
  accommodations: [{
    name: "Amiana Resort Nha Trang",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.8,
    description: "Hồ bơi nước mặn và bãi tắm riêng.",
    priceRange: "4M - 8M VND",
    address: "Phạm Văn Đồng, Nha Trang"
  }],
  diningPlaces: [{
    name: "Nem nướng Đặng Văn Quyên",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.4,
    description: "Nem nướng Ninh Hòa trừng danh.",
    priceRange: "50k - 150k VND",
    address: "16A Lãn Ông, Nha Trang"
  }],
  checkInSpots: [{
    name: "Tháp Bà Ponagar",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80",
    rating: 4.7,
    description: "Kiến trúc Chăm Pa lớn nhất miền Trung.",
    address: "2 Tháng 4, Nha Trang"
  }],
  sourceName: "Cổng Du lịch Khánh Hòa",
  sourceUrl: "https://khanhhoa.gov.vn/"
}, {
  id: "can-tho",
  name: "Cần Thơ",
  region: "TP. Cần Thơ",
  tags: ["văn hóa", "ẩm thực"],
  budget: 1,
  pace: "cham",
  habits: ["đi một mình", "gia đình"],
  interests: ["miệt vườn", "chợ nổi", "sông nước", "ẩm thực"],
  meta: "Thủ phủ miền Tây & Chợ nổi Cái Răng",
  top: false,
  text: "Cần Thơ là trái tim đồng bằng sông Cửu Long, nơi văn hóa sông nước, chợ nổi tấp nập và vườn cây ăn trái xanh mát tạo nên bức tranh miền Tây đặc sắc.",
  image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
  lat: 10.0452,
  lng: 105.7469,
  transportTips: "Xe limousine từ TP.HCM ~3-4h. Chợ nổi 5h30-7h — nghỉ gần bến phà để kịp giờ.",
  activities: [{
    dayPart: "Sáng",
    title: "Chợ nổi Cái Răng lúc bình minh",
    tip: "Thuê ghe nhỏ linh hoạt; chuẩn bị tiền mặt lẻ."
  }, {
    dayPart: "Chiều",
    title: "Nhà cổ Bình Thủy & Vườn trái cây Phong Điền",
    tip: "Ăn trái cây đúng mùa; hỏi giá vé tham quan."
  }, {
    dayPart: "Tối",
    title: "Bến Ninh Kiều & Lẩu mắm sông nước",
    tip: "Lẩu mắm nhiều món ngon khi ăn nhóm đông."
  }],
  accommodations: [{
    name: "Azerai Can Tho",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.9,
    description: "Resort 5 sao biệt lập trên Cồn Ấu.",
    priceRange: "5M - 10M VND",
    address: "Cồn Ấu, Cần Thơ"
  }],
  diningPlaces: [{
    name: "Lẩu mắm Dạ Lý",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.6,
    description: "Lẩu mắm chuẩn vị miền Tây.",
    priceRange: "300k - 600k VND",
    address: "89 Đường 3/2, Cần Thơ"
  }],
  checkInSpots: [{
    name: "Bến Ninh Kiều",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    rating: 4.8,
    description: "Điểm tham quan nổi tiếng nhất Cần Thơ.",
    address: "Ninh Kiều, Cần Thơ"
  }],
  sourceName: "Cổng TTĐT TP. Cần Thơ",
  sourceUrl: "https://cantho.gov.vn/"
}, {
  id: "ninh-binh",
  name: "Ninh Bình",
  region: "Ninh Bình",
  tags: ["leo núi", "văn hóa"],
  budget: 1,
  pace: "cham",
  habits: ["gia đình", "cặp đôi", "đi một mình"],
  interests: ["trekking", "hang động", "UNESCO", "chùa"],
  meta: "Vịnh Hạ Long trên cạn & Di sản Tràng An UNESCO",
  top: true,
  text: "Ninh Bình là 'Vịnh Hạ Long trên cạn' với hệ thống núi đá vôi, sông nước và hang động tuyệt đẹp. Tràng An được UNESCO công nhận là Di sản Thế giới kép.",
  image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  lat: 20.2506,
  lng: 105.9745,
  transportTips: "Cách Hà Nội 100km (~2h xe limousine). Xe đạp thuê tại Ninh Bình là cách lý tưởng để khám phá.",
  activities: [{
    dayPart: "Sáng",
    title: "Chèo thuyền xuyên hang đá Tràng An",
    tip: "Mất 2.5-3h. Đi sớm tránh đông; góc ảnh rất điện ảnh."
  }, {
    dayPart: "Chiều",
    title: "Leo 500 bậc thang Hang Múa",
    tip: "Mang giày đế bám; leo 15-20p và cảnh trên đỉnh rất xứng đáng."
  }, {
    dayPart: "Tối",
    title: "Dê núi Ninh Bình & Cơm cháy đặc sản",
    tip: "Dê xào sả ớt, tái chanh — hỏi quán địa phương để tìm chỗ ngon."
  }],
  accommodations: [{
    name: "Emeralda Resort Ninh Binh",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.7,
    description: "Không gian làng quê Bắc Bộ xưa.",
    priceRange: "2M - 4M VND",
    address: "Gia Viễn, Ninh Bình"
  }],
  diningPlaces: [{
    name: "Nhà hàng Chính Thư",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.5,
    description: "Chuyên các món dê núi nổi tiếng.",
    priceRange: "200k - 500k VND",
    address: "Hoa Lư, Ninh Bình"
  }],
  checkInSpots: [{
    name: "Hang Múa",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
    rating: 4.8,
    description: "View 'quốc dân' nhìn xuống Tam Cốc.",
    address: "Hoa Lư, Ninh Bình"
  }],
  sourceName: "Du lịch Ninh Bình chính thức",
  sourceUrl: "https://ninhbinhtourist.com.vn/"
}, {
  id: "hue",
  name: "Huế",
  region: "Thừa Thiên - Huế",
  tags: ["văn hóa", "ẩm thực"],
  budget: 1,
  pace: "cham",
  habits: ["cặp đôi", "đi một mình"],
  interests: ["cố đô", "lăng tẩm", "ẩm thực cung đình", "UNESCO"],
  meta: "Cố đô lăng tẩm & Ẩm thực Cung đình tinh tế",
  top: false,
  text: "Cố đô Huế gắn liền với nhà Nguyễn, ẩn chứa lăng tẩm nguy nga, cung đình hoành tráng và nền ẩm thực cung đình tinh tế độc nhất vô nhị.",
  image: "assets/img/hue.png",
  lat: 16.4637,
  lng: 107.5909,
  transportTips: "Bay đến sân bay Phú Bài hoặc đi tàu hỏa. Thuê xe máy để tham quan lăng tẩm ngoại ô.",
  activities: [{
    dayPart: "Sáng",
    title: "Hoàng Thành & Đại Nội Huế",
    tip: "Mặc kín đáo vào điện thờ; đi sớm tránh đoàn khách."
  }, {
    dayPart: "Chiều",
    title: "Lăng Khải Định & Lăng Minh Mạng",
    tip: "Xe máy hoặc xe ôm để đi hết loạt lăng trong 1 ngày."
  }, {
    dayPart: "Tối",
    title: "Chợ Đông Ba & Bún bò Huế chuẩn vị",
    tip: "Bún bò Ngự Bình hoặc O Xuân — địa chỉ người Huế yêu thích."
  }],
  accommodations: [{
    name: "Azerai La Residence",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.9,
    description: "Dinh thự cổ bên sông Hương.",
    priceRange: "4.5M - 8M VND",
    address: "05 Lê Lợi, Huế"
  }],
  diningPlaces: [{
    name: "Bún Bò Huế O Xuân",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    rating: 4.6,
    description: "Bún bò chuẩn vị người bản địa.",
    priceRange: "40k - 70k VND",
    address: "17 Lý Thường Kiệt"
  }],
  checkInSpots: [{
    name: "Đại Nội Huế",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80",
    rating: 4.8,
    description: "Di tích lịch sử kiến trúc cung đình.",
    address: "Phú Hậu, Huế"
  }],
  sourceName: "Trung tâm Bảo tồn Di tích Cố đô Huế",
  sourceUrl: "https://hueworldheritage.org.vn/"
}, {
  id: "ha-giang",
  name: "Hà Giang",
  region: "Hà Giang",
  tags: ["leo núi", "văn hóa"],
  budget: 1,
  pace: "nhanh",
  habits: ["đi một mình", "đi sớm"],
  interests: ["trekking", "moto", "bản làng", "check-in"],
  meta: "Cung đường đèo hiểm trở & Hoa tam giác mạch",
  top: true,
  text: "Tỉnh địa đầu Tổ quốc Hà Giang chinh phục phượt thủ bằng đèo Mã Pí Lèng huyền thoại, Đồng Văn Cổ Trấn cổ kính và mùa hoa tam giác mạch tím ngát tháng 10-11.",
  image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  lat: 23.2241,
  lng: 104.9834,
  transportTips: "Xe khách từ Hà Nội ~7-8h. Thuê moto tại thị xã hoặc đặt off-road tour có guide kinh nghiệm.",
  activities: [{
    dayPart: "Sáng",
    title: "Cột cờ Lũng Cú — Điểm cực Bắc VN",
    tip: "Leo 389 bậc; ảnh cờ đỏ lúc bình minh cực đẹp và xúc động."
  }, {
    dayPart: "Chiều",
    title: "Đèo Mã Pí Lèng hùng vĩ nhất Việt Nam",
    tip: "Lái xe cực cẩn thận; đường hẹp vực sâu hàng trăm mét."
  }, {
    dayPart: "Tối",
    title: "Chợ đêm Đồng Văn Cổ Trấn",
    tip: "Thử Mèn mén, Thắng cố ngựa — đặc sản khó quên vùng cao."
  }],
  accommodations: [{
    name: "H'Mong Village Resort",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.8,
    description: "Nhà hình quẩy tấu độc đáo.",
    priceRange: "1.5M - 3.5M VND",
    address: "Quản Bạ, Hà Giang"
  }],
  diningPlaces: [{
    name: "Cháo ấu tẩu Hương",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.5,
    description: "Món cháo độc đáo gắn liền vùng cao.",
    priceRange: "40k - 60k VND",
    address: "Thị xã Hà Giang"
  }],
  checkInSpots: [{
    name: "Dốc Thẩm Mã",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
    rating: 4.9,
    description: "Cung đường đèo chín khoanh uốn lượn.",
    address: "Quốc lộ 4C, Hà Giang"
  }],
  sourceName: "Cổng TTĐT Tỉnh Hà Giang",
  sourceUrl: "https://hagiang.gov.vn/"
}, {
  id: "con-dao",
  name: "Côn Đảo",
  region: "Bà Rịa - Vũng Tàu",
  tags: ["biển", "nghỉ dưỡng"],
  budget: 3,
  pace: "cham",
  habits: ["cặp đôi", "đi một mình"],
  interests: ["biển hoang", "rùa biển", "lịch sử", "lặn biển"],
  meta: "Thiên đường biển hoang nguyên sơ & Di tích lịch sử",
  top: true,
  text: "Côn Đảo còn nguyên vẻ hoang sơ với bãi biển vắng tuyệt đẹp, vườn quốc gia nguyên sinh và trải nghiệm độc đáo xem rùa biển đẻ trứng đêm hè.",
  image: "https://images.unsplash.com/photo-1559592413-7cec096d7b88?w=800&q=80",
  lat: 8.6914,
  lng: 106.6061,
  transportTips: "Bay từ TP.HCM hoặc Cần Thơ ~50 phút. Thuê xe máy trên đảo. Mùa rùa đẻ trứng: tháng 5-10.",
  activities: [{
    dayPart: "Sáng",
    title: "Bãi Đầm Trầu / Bãi Ông Đụng hoang sơ",
    tip: "Nước trong xanh; mang đồ snorkel để khám phá san hô."
  }, {
    dayPart: "Chiều",
    title: "Vườn Quốc gia Côn Đảo tham quan",
    tip: "Đăng ký xem rùa đêm tại Ban quản lý VQG từ sáng sớm."
  }, {
    dayPart: "Tối",
    title: "Nghĩa trang Hàng Dương tưởng niệm",
    tip: "Trang nghiêm; mặc lịch sự và không chụp ảnh tuỳ tiện."
  }],
  accommodations: [{
    name: "Six Senses Con Dao",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    rating: 5.0,
    description: "Khu nghỉ dưỡng siêu sang trọng.",
    priceRange: "15M - 40M VND",
    address: "Bãi Đất Dốc, Côn Đảo"
  }],
  diningPlaces: [{
    name: "Ốc Vú Nàng Côn Đảo",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.6,
    description: "Hải sản tươi sống đặc trưng đảo.",
    priceRange: "200k - 500k VND",
    address: "Chợ đêm Côn Đảo"
  }],
  checkInSpots: [{
    name: "Bãi Đầm Trầu",
    image: "https://images.unsplash.com/photo-1415399153348-c05e9599f298?w=400&q=80",
    rating: 4.8,
    description: "Bãi biển đẹp nhất với máy bay hạ cánh sát đầu.",
    address: "Gần sân bay Cỏ Ống"
  }],
  sourceName: "Vườn Quốc gia Côn Đảo",
  sourceUrl: "https://vuondaocon.com.vn/"
}, {
  id: "quy-nhon",
  name: "Quy Nhơn",
  region: "Bình Định",
  tags: ["biển", "văn hóa"],
  budget: 1,
  pace: "cham",
  habits: ["đi một mình", "cặp đôi"],
  interests: ["biển vắng", "Chăm Pa", "hải sản rẻ", "bình yên"],
  meta: "Biển đẹp yên bình & Tháp Chăm nghìn năm tuổi",
  top: false,
  text: "Quy Nhơn là viên ngọc ẩn của Việt Nam — biển Kỳ Co trong vắt như ngọc bích, tháp Chăm cổ kính và ẩm thực hải sản siêu tươi giá bình dân.",
  image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
  lat: 13.7765,
  lng: 109.2235,
  transportTips: "Bay đến sân bay Phù Cát. Grab rẻ hơn TP lớn; thuê xe máy đi Kỳ Co, Hòn Khô.",
  activities: [{
    dayPart: "Sáng",
    title: "Bãi Kỳ Co & Hòn Khô hoang sơ",
    tip: "Đặt thuyền từ 6h; nước trong xanh nhất buổi sáng sớm."
  }, {
    dayPart: "Chiều",
    title: "Tháp Đôi & Tháp Bánh Ít Chăm Pa",
    tip: "Vào tham quan miễn phí; mang nón rộng vành vì trời nắng."
  }, {
    dayPart: "Tối",
    title: "Bún chả cá & Chợ đêm ẩm thực",
    tip: "Hải sản cực tươi, giá bình dân — đặc điểm nổi bật Quy Nhơn."
  }],
  accommodations: [{
    name: "FLC City Hotel Quy Nhon",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.7,
    description: "Khách sạn hiện đại ngay mặt biển.",
    priceRange: "1.5M - 3M VND",
    address: "An Dương Vương, Quy Nhơn"
  }],
  diningPlaces: [{
    name: "Nhà hàng Hải Sỹ",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.5,
    description: "Nổi tiếng với món tôm hùm tươi sống.",
    priceRange: "300k - 800k VND",
    address: "35B Nguyễn Huệ"
  }],
  checkInSpots: [{
    name: "Eo Gió",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&q=80",
    rating: 4.9,
    description: "Nơi ngắm hoàng hôn đẹp nhất Việt Nam.",
    address: "Nhơn Lý, Quy Nhơn"
  }],
  sourceName: "Cổng TTĐT Tỉnh Bình Định",
  sourceUrl: "https://binhdinh.gov.vn/"
}, {
  id: "phan-thiet",
  name: "Mũi Né – Phan Thiết",
  region: "Bình Thuận",
  tags: ["biển", "ẩm thực", "nghỉ dưỡng"],
  budget: 2,
  pace: "cham",
  habits: ["cặp đôi", "gia đình"],
  interests: ["biển", "đồi cát", "kitesurfing", "resort"],
  meta: "Đồi cát đỏ kỳ ảo & Thiên đường kite-surfing",
  top: false,
  text: "Mũi Né nổi bật với đồi cát đỏ và trắng kỳ ảo, bãi biển ít người và gió lộng quanh năm — thiên đường kite-surfing bậc nhất Việt Nam.",
  image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800&q=80",
  lat: 10.9804,
  lng: 108.2591,
  transportTips: "Xe khách/tàu hoả từ TP.HCM ~4h. Nhiều resort có xe đón từ TP.HCM.",
  activities: [{
    dayPart: "Sáng",
    title: "Đồi Cát Đỏ / Bàu Trắng lúc bình minh",
    tip: "Đến lúc 5h30-7h để chụp ảnh; tránh trưa có thể 40°C."
  }, {
    dayPart: "Chiều",
    title: "Kite-surf / Tắm biển Mũi Né",
    tip: "Mùa gió NE (tháng 10-4) tốt nhất cho kite-surfing."
  }, {
    dayPart: "Tối",
    title: "Chợ hải sản Phan Thiết tươi sống",
    tip: "Ghẹ, tôm hùm — hỏi giá /con hoặc /kg trước khi chọn."
  }],
  accommodations: [{
    name: "Centara Mirage Resort",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    rating: 4.8,
    description: "Phong cách Địa Trung Hải hiện đại.",
    priceRange: "2.5M - 5.5M VND",
    address: "Mũi Né, Phan Thiết"
  }],
  diningPlaces: [{
    name: "Lẩu thả Mũi Né",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.6,
    description: "Món lẩu đặc sản Bình Thuận.",
    priceRange: "200k - 500k VND",
    address: "Nguyễn Đình Chiểu, Mũi Né"
  }],
  checkInSpots: [{
    name: "Bàu Trắng",
    image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=400&q=80",
    rating: 4.9,
    description: "Tiểu sa mạc Sahara của Việt Nam.",
    address: "Bắc Bình, Bình Thuận"
  }],
  sourceName: "Cổng TTĐT Tỉnh Bình Thuận",
  sourceUrl: "https://binhthuan.gov.vn/"
}, {
  id: "tphcm",
  name: "TP. Hồ Chí Minh",
  region: "TP. Hồ Chí Minh",
  tags: ["ẩm thực", "văn hóa"],
  budget: 2,
  pace: "nhanh",
  habits: ["cú đêm", "gia đình", "đi một mình"],
  interests: ["mua sắm", "ẩm thực", "lịch sử", "nightlife"],
  meta: "Thành phố năng động nhất Việt Nam",
  top: false,
  text: "TP.HCM bừng sáng liên tục với ẩm thực đường phố phong phú, bảo tàng lịch sử sâu sắc và đời sống văn hóa cực kỳ đa dạng và hiện đại.",
  image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
  lat: 10.8231,
  lng: 106.6297,
  transportTips: "Grab tiện lợi nhất. Tránh cao điểm 7-9h sáng và 17-19h chiều.",
  activities: [{
    dayPart: "Sáng",
    title: "Dinh Độc Lập & Bảo tàng Chứng tích Chiến tranh",
    tip: "Mua vé online; trang phục lịch sự khi vào Dinh."
  }, {
    dayPart: "Chiều",
    title: "Chợ Bến Thành & Phố đi bộ Nguyễn Huệ",
    tip: "Mặc cả 30-50% ở chợ; cẩn thận móc túi đám đông."
  }, {
    dayPart: "Tối",
    title: "Rooftop Bar & Ẩm thực Sài Gòn",
    tip: "Bar tầng cao nhìn toàn cảnh về đêm — đặt bàn trước."
  }],
  accommodations: [{
    name: "The Reverie Saigon",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.9,
    description: "Khách sạn 6 sao sang trọng nhất.",
    priceRange: "8M - 20M VND",
    address: "Quận 1, TP.HCM"
  }],
  diningPlaces: [{
    name: "Bánh mì Huỳnh Hoa",
    image: "https://images.unsplash.com/photo-1509722747041-074f18d68246?w=400&q=80",
    rating: 4.7,
    description: "Ổ bánh mì đầy ắp các loại chả.",
    priceRange: "60k - 80k VND",
    address: "Lê Thị Riêng, Quận 1"
  }],
  checkInSpots: [{
    name: "Landmark 81 Skyview",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80",
    rating: 4.8,
    description: "Đài quan sát cao nhất Đông Nam Á.",
    address: "Bình Thạnh, TP.HCM"
  }],
  sourceName: "Sở Du lịch TP. Hồ Chí Minh",
  sourceUrl: "https://tourism.hochiminhcity.gov.vn/"
}, {
  id: "buon-ma-thuot",
  name: "Buôn Ma Thuột",
  region: "Đắk Lắk",
  tags: ["văn hóa", "ẩm thực"],
  budget: 1,
  pace: "cham",
  habits: ["đi một mình", "gia đình"],
  interests: ["cà phê", "voi", "thác", "bản làng"],
  meta: "Thủ đô Cà phê Việt Nam & Văn hóa cồng chiêng",
  top: false,
  text: "Buôn Ma Thuột là thủ phủ cà phê nổi tiếng thế giới, nơi đất đỏ bazan nuôi dưỡng cà phê Robusta hảo hạng cùng văn hóa cồng chiêng Tây Nguyên UNESCO.",
  image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  lat: 12.6797,
  lng: 108.0506,
  transportTips: "Bay thẳng đến sân bay Buôn Ma Thuột hoặc xe khách từ TP.HCM (~8h). Thuê xe máy đi buôn làng.",
  activities: [{
    dayPart: "Sáng",
    title: "Vườn cà phê & Trải nghiệm hái cà phê",
    tip: "Mùa thu hoạch tháng 11-1; đặt tour Farm-to-Cup trước."
  }, {
    dayPart: "Chiều",
    title: "Thác Gia Long & Chứa Chan hùng vĩ",
    tip: "Mùa mưa cuối năm nước to rất đẹp; kiểm tra đường vào."
  }, {
    dayPart: "Tối",
    title: "Cơm lam & Rượu cần tại buôn làng Ê Đê",
    tip: "Lễ hội cồng chiêng nếu may mắn trùng lịch — vô cùng ấn tượng."
  }],
  accommodations: [{
    name: "Muong Thanh Luxury BMT",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.6,
    description: "Khách sạn cao cấp trung tâm thành phố.",
    priceRange: "1.2M - 2.5M VND",
    address: "Nguyễn Tất Thành, BMT"
  }],
  diningPlaces: [{
    name: "Bún đỏ Buôn Ma Thuột",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    rating: 4.5,
    description: "Món ăn đường phố đặc trưng sợi bún đỏ.",
    priceRange: "30k - 50k VND",
    address: "Phan Đình Giót, BMT"
  }],
  checkInSpots: [{
    name: "Bảo tàng Thế giới Cà phê",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
    rating: 4.9,
    description: "Kiến trúc nhà rông Tây Nguyên độc đáo.",
    address: "Nguyễn Đình Chiểu, BMT"
  }],
  sourceName: "Cổng TTĐT Tỉnh Đắk Lắk",
  sourceUrl: "https://daklak.gov.vn/"
}, {
  id: "tam-dao",
  name: "Tam Đảo",
  region: "Vĩnh Phúc",
  tags: ["leo núi", "nghỉ dưỡng"],
  budget: 1,
  pace: "cham",
  habits: ["gia đình", "cặp đôi"],
  interests: ["núi", "sương mù", "nghỉ dưỡng", "thiên nhiên"],
  meta: "Núi sương mù lãng mạn chỉ 80km từ Hà Nội",
  top: false,
  text: "Tam Đảo là ốc đảo xanh mát với thị trấn núi bồng bềnh trong mây, kiến trúc Pháp cổ điển, rừng nguyên sinh và khí hậu mát mẻ quanh năm.",
  image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80",
  lat: 21.4684,
  lng: 105.6436,
  transportTips: "Ô tô từ Hà Nội ~1.5-2h. Đường núi dốc và trơn khi mưa — cẩn thận khi lái xe.",
  activities: [{
    dayPart: "Sáng",
    title: "Leo đỉnh Phù Nghĩa ngắm mây cuộn",
    tip: "Xuất phát 5h30 để bắt sương mù đẹp; sương tan lúc 9-10h."
  }, {
    dayPart: "Chiều",
    title: "Tây Thiên & Rừng nguyên sinh cáp treo",
    tip: "Trang phục lịch sự khi vào khu chùa; cáp treo 2500m dài nhất VN."
  }, {
    dayPart: "Tối",
    title: "Lợn cắp nách & Su su xào tỏi đặc sản",
    tip: "Chọn nhà hàng có đánh giá tốt trên Google Maps."
  }],
  accommodations: [{
    name: "Poko Eco Lodge Tam Dao",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
    rating: 4.5,
    description: "Khu nghỉ dưỡng xanh giữa lưng chừng núi.",
    priceRange: "1M - 2.5M VND",
    address: "Thị trấn Tam Đảo"
  }],
  diningPlaces: [{
    name: "Su su Tam Đảo xào tỏi",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    rating: 4.7,
    description: "Đặc sản rau xanh nổi tiếng vùng núi.",
    priceRange: "50k - 150k VND",
    address: "Tam Đảo"
  }],
  checkInSpots: [{
    name: "Cổng trời Tam Đảo",
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&q=80",
    rating: 4.6,
    description: "Nơi sương mù bao phủ huyền ảo.",
    address: "Vĩnh Phúc"
  }],
  sourceName: "Cổng TTĐT Tỉnh Vĩnh Phúc",
  sourceUrl: "https://vinhphuc.gov.vn/"
}, {
  id: "mui-ne-fantasy",
  name: "Làng Chài Cổ Thạch",
  region: "Bình Thuận",
  tags: ["biển", "văn hóa"],
  budget: 1,
  pace: "cham",
  habits: ["đi một mình", "cặp đôi"],
  interests: ["biển đá", "nhiếp ảnh", "yên tĩnh", "bình minh"],
  meta: "Bãi đá san hô huyền bí & Bình minh nhiếp ảnh",
  top: false,
  text: "Cổ Thạch là bí mật ít người biết với bãi đá cuội và san hô kỳ lạ lộ ra khi nước ròng, làng chài mộc mạc và bình minh rực rỡ được nhiếp ảnh gia săn tìm.",
  image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80",
  lat: 11.1543,
  lng: 108.3522,
  transportTips: "Xe máy từ Phan Thiết ~50km. Tra lịch thuỷ triều trước để bắt được bãi đá lộ.",
  activities: [{
    dayPart: "Sáng",
    title: "Chụp ảnh bãi đá lúc bình minh & nước ròng",
    tip: "Dậy 4h30 để có mặt lúc 5h; đi dép cao su chống trơn."
  }, {
    dayPart: "Chiều",
    title: "Làng chài Cổ Thạch mua hải sản tươi",
    tip: "Mang nước theo vì ít quán ăn; hải sản giá địa phương cực rẻ."
  }, {
    dayPart: "Tối",
    title: "Hoàng hôn đỏ rực tuyệt đẹp tại bãi đá",
    tip: "Trời quang cực đẹp; mang máy ảnh tốt để ghi lại khoảnh khắc."
  }],
  accommodations: [{
    name: "Homestay Cổ Thạch",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&q=80",
    rating: 4.2,
    description: "Chỗ nghỉ dân dã gần gũi làng chài.",
    priceRange: "300k - 600k VND",
    address: "Cổ Thạch, Bình Thuận"
  }],
  diningPlaces: [{
    name: "Hải sản vỉa hè Cổ Thạch",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.5,
    description: "Hải sản tươi rói chế biến đơn giản.",
    priceRange: "100k - 300k VND",
    address: "Bãi biển Cổ Thạch"
  }],
  checkInSpots: [{
    name: "Bãi đá bảy màu",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=400&q=80",
    rating: 4.8,
    description: "Hàng ngàn viên đá đủ màu sắc sặc sỡ.",
    address: "Tuy Phong, Bình Thuận"
  }],
  sourceName: "Cổng TTĐT Tỉnh Bình Thuận",
  sourceUrl: "https://binhthuan.gov.vn/"
}, {
  id: "sapa-fansipan",
  name: "Đỉnh Fansipan",
  region: "Lào Cai",
  tags: ["leo núi", "văn hóa"],
  budget: 2,
  pace: "nhanh",
  habits: ["đi một mình", "gia đình"],
  interests: ["trekking", "cáp treo", "săn mây", "đỉnh núi"],
  meta: "Nóc nhà Đông Dương 3.143m",
  top: true,
  text: "Đỉnh núi cao nhất Việt Nam và bán đảo Đông Dương. Lên bằng cáp treo ngắm biển mây hùng vĩ hoặc trekking chinh phục đỉnh cao.",
  image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
  lat: 22.3045,
  lng: 103.7719,
  transportTips: "Cáp treo Sun World Fansipan Legend lên đỉnh chỉ 15 phút. Xuất phát từ Sa Pa trung tâm.",
  activities: [{
    dayPart: "Sáng",
    title: "Đi cáp treo lúc bình minh",
    tip: "Mây phủ sáng sớm — khoảnh khắc biển mây cực đẹp."
  }, {
    dayPart: "Trưa",
    title: "Ăn buffet tại Ga Hoàng Liên",
    tip: "Combo cáp treo + buffet thường tiết kiệm hơn."
  }, {
    dayPart: "Chiều",
    title: "Viếng quần thể tâm linh trên đỉnh",
    tip: "Đại tượng Phật A Di Đà lớn nhất Việt Nam."
  }],
  accommodations: [{
    name: "Hotel de la Coupole",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.9,
    description: "Khách sạn sang trọng nhất Sa Pa.",
    priceRange: "3.5M - 7M VND",
    address: "1 Hoàng Liên, Sa Pa"
  }],
  diningPlaces: [{
    name: "Nhà hàng A Phủ",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.5,
    description: "Gà nướng tiêu xanh danh bất hư truyền.",
    priceRange: "150k - 400k VND",
    address: "Sa Pa"
  }],
  checkInSpots: [{
    name: "Đỉnh Fansipan 3.143m",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
    rating: 4.9,
    description: "Chinh phục nóc nhà Đông Dương.",
    address: "Hoàng Liên Sơn"
  }],
  sourceName: "Sun World Fansipan Legend",
  sourceUrl: "https://fansipanlegend.sunworld.vn/"
}, {
  id: "moc-chau",
  name: "Mộc Châu",
  region: "Sơn La",
  tags: ["văn hóa", "nghỉ dưỡng"],
  budget: 1,
  pace: "cham",
  habits: ["cặp đôi", "gia đình"],
  interests: ["đồi chè", "hái dâu", "bản làng", "rừng thông"],
  meta: "Thảo nguyên xanh mát & Hoa mận trắng tháng Giêng",
  top: false,
  text: "Mộc Châu quyến rũ với đồi chè Trái Tim, rừng thông Bản Áng, thác Dải Yếm và những vườn mận nở trắng muốt khi xuân về.",
  image: "https://images.unsplash.com/photo-1467377791767-c929b5dc9a23?w=800&q=80",
  lat: 20.8542,
  lng: 104.6465,
  transportTips: "Xe limousine từ Hà Nội mất khoảng 4 giờ qua quốc lộ 6. Mùa hoa mận đẹp nhất vào tháng 1-2.",
  activities: [{
    dayPart: "Sáng",
    title: "Tham quan Đồi Chè Trái Tim",
    tip: "Nắng sớm chiếu lên lá chè đọng sương — rất ăn hình."
  }, {
    dayPart: "Chiều",
    title: "Rừng thông Bản Áng & Hái dâu tây",
    tip: "Dâu tây mùa lạnh (tháng 1-3) là ngon nhất."
  }, {
    dayPart: "Tối",
    title: "Thưởng thức Bê chao vỉa hè",
    tip: "Ghé quán 64 hoặc 70 thử đặc sản nổi danh."
  }],
  accommodations: [{
    name: "Moc Chau Arena Village",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.4,
    description: "Nghỉ dưỡng trong nhà container giữa đồi chè.",
    priceRange: "500k - 1.2M VND",
    address: "Thị trấn Mộc Châu"
  }],
  diningPlaces: [{
    name: "Bê chao Mộc Châu",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.6,
    description: "Món ngon trứ danh thảo nguyên.",
    priceRange: "100k - 300k VND",
    address: "Tiểu khu 32, Mộc Châu"
  }],
  checkInSpots: [{
    name: "Đồi Chè Trái Tim",
    image: "https://images.unsplash.com/photo-1467377791767-c929b5dc9a23?w=800&q=80",
    rating: 4.8,
    description: "Biểu tượng lãng mạn của Mộc Châu.",
    address: "Tân Lập, Mộc Châu"
  }],
  sourceName: "Cổng TTĐT Tỉnh Sơn La",
  sourceUrl: "https://sonla.gov.vn/"
}, {
  id: "phong-nha",
  name: "Phong Nha - Kẻ Bàng",
  region: "Quảng Bình",
  tags: ["leo núi", "nghỉ dưỡng"],
  budget: 2,
  pace: "nhanh",
  habits: ["đi một mình", "cặp đôi"],
  interests: ["hang động", "trekking", "chèo thuyền", "di sản"],
  meta: "Vương quốc Hang Động & Động Sơn Đoòng lớn nhất TG",
  top: true,
  text: "Vườn quốc gia với hơn 300 hang động lớn nhỏ, sông ngầm hùng vĩ. Nơi có động Sơn Đoòng — lớn nhất thế giới — và hàng loạt trải nghiệm phiêu lưu đỉnh cao.",
  image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  lat: 17.5898,
  lng: 106.281,
  transportTips: "Bay đến sân bay Đồng Hới hoặc đi tàu ga Đồng Hới. Thuê xe máy vào thị trấn Phong Nha.",
  activities: [{
    dayPart: "Sáng",
    title: "Động Thiên Đường / Động Tiên Sơn",
    tip: "Mang giày bám; hành trình đi bộ dài trong hang."
  }, {
    dayPart: "Chiều",
    title: "Zipline & Tắm bùn Sông Chày",
    tip: "Trò chơi sông nước vui nhộn, mặc đồ bơi tiện lợi."
  }, {
    dayPart: "Tối",
    title: "Gà nướng chấm muối cheo sông Son",
    tip: "Nhiều quán nướng đặc sản ven bờ sông thơ mộng."
  }],
  accommodations: [{
    name: "Phong Nha Farmstay",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    rating: 4.7,
    description: "Nghỉ dưỡng giữa khung cảnh làng quê thanh bình.",
    priceRange: "800k - 2M VND",
    address: "Khương Hà, Quảng Bình"
  }],
  diningPlaces: [{
    name: "Gà nướng Phong Nha",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.6,
    description: "Món gà nướng đặc sản kèm muối cheo.",
    priceRange: "150k - 300k VND",
    address: "Ven sông Son, Phong Nha"
  }],
  checkInSpots: [{
    name: "Sông Son",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
    rating: 4.8,
    description: "Dòng sông xanh ngắt chảy xuyên hang động.",
    address: "Phong Nha, Quảng Bình"
  }],
  sourceName: "Vườn Quốc gia Phong Nha - Kẻ Bàng",
  sourceUrl: "https://phongnhakebang.vn/"
}, {
  id: "pu-luong",
  name: "Pù Luông",
  region: "Thanh Hóa",
  tags: ["leo núi", "văn hóa", "nghỉ dưỡng"],
  budget: 2,
  pace: "cham",
  habits: ["gia đình", "cặp đôi"],
  interests: ["ruộng bậc thang", "bảo tồn", "nghỉ dưỡng", "chụp ảnh"],
  meta: "Thiên đường hoang sơ & Resort sinh thái xứ Thanh",
  top: false,
  text: "Khu bảo tồn thiên nhiên tuyệt đẹp với các resort sinh thái hòa vào ruộng bậc thang bạt ngàn và nhịp sống thanh bình của người Thái.",
  image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
  lat: 20.4633,
  lng: 105.2154,
  transportTips: "Cách Hà Nội ~4 tiếng ô tô. Đường có đèo hẹp qua Bản Lác - Mai Châu — hỏi tài xế kinh nghiệm.",
  activities: [{
    dayPart: "Sáng",
    title: "Đi bộ Bản Đôn & xem guồng nước",
    tip: "Guồng nước khổng lồ là góc check-in cực phẩm."
  }, {
    dayPart: "Chiều",
    title: "Hồ bơi vô cực ngắm ruộng bậc thang",
    tip: "Hồ bơi tràn bờ view thung lũng tuyệt đẹp."
  }, {
    dayPart: "Tối",
    title: "Múa xòe & Vịt Cổ Lũng đặc sản",
    tip: "Vịt Cổ Lũng thịt chắc, ăn kèm xôi nếp thơm."
  }],
  accommodations: [{
    name: "Pu Luong Retreat",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80",
    rating: 4.8,
    description: "Resort sinh thái hòa quyện thiên nhiên.",
    priceRange: "2M - 4M VND",
    address: "Bản Đôn, Pù Luông"
  }],
  diningPlaces: [{
    name: "Vịt Cổ Lũng nướng",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
    rating: 4.7,
    description: "Đặc sản không thể bỏ qua tại Pù Luông.",
    priceRange: "200k - 400k VND",
    address: "Các nhà hàng tại Bản Đôn"
  }],
  checkInSpots: [{
    name: "Ruộng bậc thang Pù Luông",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80",
    rating: 4.9,
    description: "Biển vàng lúa chín giữa đại ngàn.",
    address: "Bá Thước, Thanh Hóa"
  }],
  sourceName: "Cổng TTĐT Tỉnh Thanh Hóa",
  sourceUrl: "https://thanhhoa.gov.vn/"
}, {
  id: "phu-yen",
  name: "Phú Yên",
  region: "Phú Yên",
  tags: ["biển", "văn hóa"],
  budget: 1,
  pace: "cham",
  habits: ["đi một mình", "gia đình"],
  interests: ["biển đá", "yên tĩnh", "nhiếp ảnh", "ẩm thực"],
  meta: "Xứ sở Hoa Vàng Trên Cỏ Xanh & Gành Đá Đĩa",
  top: true,
  text: "Phú Yên hút hồn bằng Gành Đá Đĩa kỳ lạ, Mũi Điện — điểm đón bình minh đầu tiên nhất Việt Nam, và những bãi biển xanh ngắt còn nguyên vẹn.",
  image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
  lat: 13.0886,
  lng: 109.3243,
  transportTips: "Sân bay Tuy Hòa cách trung tâm chỉ 5-7km. Thuê xe máy để tự do khám phá dọc biển.",
  activities: [{
    dayPart: "Sáng",
    title: "Đón bình minh ở Mũi Điện cực Đông",
    tip: "Có mặt trước 5h sáng; có đoạn đi bộ lên ngọn hải đăng lịch sử."
  }, {
    dayPart: "Chiều",
    title: "Gành Đá Đĩa & Bãi Xép huyền thoại",
    tip: "Nắng chói — mang ô/dù. Vé tham quan rất rẻ."
  }, {
    dayPart: "Tối",
    title: "Sashimi & Mắt cá ngừ đại dương",
    tip: "Cá ngừ Phú Yên là đặc sản nổi tiếng cả nước — đừng bỏ qua."
  }],
  sourceName: "Cổng TTĐT Tỉnh Phú Yên",
  sourceUrl: "https://phuyen.gov.vn/"
}];
