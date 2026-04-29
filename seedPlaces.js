/**
 * seedPlaces.js — Script nạp lại toàn bộ dữ liệu điểm du lịch vào MongoDB
 * Chạy: node seedPlaces.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

const placesData = [
  {
    id: "phu-quoc",
    name: "Phú Quốc",
    region: "Kiên Giang",
    tags: ["biển", "ẩm thực", "nghỉ dưỡng"],
    budget: 3, pace: "vua",
    habits: ["gia đình", "cặp đôi", "đi sớm"],
    interests: ["biển", "resort", "hải sản", "chụp ảnh"],
    meta: "Biển xanh, hoàng hôn & hải sản tươi",
    text: "Đảo ngọc Phú Quốc với dải cát trắng mịn, resort cao cấp trải dài, hệ sinh thái biển đa dạng, cùng các khu chợ đêm sầm uất và làng chài truyền thống ven biển. Là điểm đến hàng đầu cho kỳ nghỉ gia đình và tuần trăng mật.",
    image: "assets/img/phu-quoc.png",
    lat: 10.2899, lng: 103.984, top: true,
    transportTips: "Nên đặt vé bay thẳng đến Phú Quốc (sân bay Phú Quốc). Trong đảo, thuê xe máy hoặc taxi điện VinBus để dạo quanh.",
    activities: [
      { dayPart: "Sáng", title: "Khám phá Bãi Sao / Bãi Khem", tip: "Đi sớm tránh nắng gắt; chuẩn bị kem chống nắng thân thiện rạn san hô." },
      { dayPart: "Chiều", title: "Lặn biển ngắm san hô (Snorkel)", tip: "Đặt tour ghép có hướng dẫn viên đi kèm để đảm bảo an toàn." },
      { dayPart: "Tối", title: "Khám phá Chợ đêm Dinh Cậu", tip: "Hải sản niêm yết giá công khai, nhưng vẫn nên hỏi trước khi gọi món." }
    ],
    amusementPlaces: [
      { 
        name: "VinWonders Phú Quốc", 
        image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80", 
        rating: 4.8,
        description: "Công viên chủ đề lớn nhất Việt Nam với hơn 100 trò chơi hấp dẫn, khu vui chơi thế giới nước và thủy cung sứa vô cùng ấn tượng.",
        ticketPrice: "950,000 VND",
        openingHours: "09:00 - 19:30",
        address: "Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang"
      },
      { 
        name: "Sun World Hòn Thơm", 
        image: "https://images.unsplash.com/photo-1544971587-b842c27f8e14?w=400&q=80", 
        rating: 4.9,
        description: "Khu du lịch sinh thái bao gồm cáp treo vượt biển dài nhất thế giới, công viên nước Aquatopia và nhiều bãi biển đẹp tuyệt vời.",
        ticketPrice: "600,000 VND (Cáp khứ hồi)",
        openingHours: "09:00 - 17:00",
        address: "Bãi Đất Đỏ, An Thới, Phú Quốc, Kiên Giang"
      },
      { 
        name: "Grand World Phú Quốc", 
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80", 
        rating: 4.6,
        description: "Thành phố không ngủ lấy cảm hứng từ các thành phố Châu Âu, có sông Venice, khu chợ đêm và các show diễn hoành tráng.",
        ticketPrice: "Vào cửa Miễn phí",
        openingHours: "24/24",
        address: "Bãi Dài, Gành Dầu, Phú Quốc, Kiên Giang"
      }
    ],
    accommodations: [
      {
        name: "JW Marriott Phu Quoc Emerald Bay Resort",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.9,
        description: "Khu nghỉ dưỡng 5 sao đẳng cấp với kiến trúc trường đại học Lamarck độc đáo, bãi Khem tuyệt đẹp.",
        priceRange: "8,000,000 - 15,000,000 VND",
        address: "Bãi Khem, An Thới, Phú Quốc, Kiên Giang"
      },
      {
        name: "InterContinental Phu Quoc Long Beach Resort",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
        rating: 4.8,
        description: "Sở hữu hồ bơi vô cực và Sky Bar cao nhất đảo, view ngắm hoàng hôn đỉnh cao.",
        priceRange: "4,500,000 - 9,000,000 VND",
        address: "Bãi Dài, Dương Tơ, Phú Quốc, Kiên Giang"
      }
    ],
    diningPlaces: [
      {
        name: "Nhà hàng Xin Chào",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.5,
        description: "Nhà hàng hải sản view biển cực đẹp ngay trung tâm Dương Đông.",
        priceRange: "300,000 - 1,000,000 VND",
        address: "66 Trần Hưng Đạo, Dương Đông, Phú Quốc"
      },
      {
        name: "Bún Quậy Kiến Xây",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        rating: 4.4,
        description: "Đặc sản không thể bỏ qua với cách chế biến độc đáo và nước chấm tự pha.",
        priceRange: "50,000 - 80,000 VND",
        address: "28 Bạch Đằng, Dương Đông, Phú Quốc"
      }
    ],
    checkInSpots: [
      {
        name: "Sunset Sanato Beach Club",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
        rating: 4.7,
        description: "Điểm check-in nổi tiếng với những chú voi chân dài và biểu tượng nghệ thuật trên bãi biển.",
        address: "Bắc Bãi Trường, Dương Tơ, Phú Quốc"
      },
      {
        name: "Ga An Thới",
        image: "https://images.unsplash.com/photo-1544971587-b842c27f8e14?w=400&q=80",
        rating: 4.6,
        description: "Được mệnh danh là 'Đấu trường La Mã' phiên bản Việt với kiến trúc cổ điển hoành tráng.",
        address: "Bãi Đất Đỏ, An Thới, Phú Quốc"
      }
    ],
    sourceName: "Cổng TTĐT Tỉnh Kiên Giang",
    sourceUrl: "https://kiengiang.gov.vn/"
  },
  {
    id: "hoi-an",
    name: "Hội An",
    region: "Quảng Nam",
    tags: ["văn hóa", "ẩm thực"],
    budget: 2, pace: "cham",
    habits: ["cặp đôi", "đi một mình", "cú đêm"],
    interests: ["phố cổ", "ẩm thực", "làng nghề", "UNESCO"],
    meta: "Phố cổ đèn lồng & Di sản văn hóa UNESCO",
    text: "Hội An là di sản văn hóa thế giới được UNESCO công nhận, đặc trưng bởi những nếp nhà cổ kính sơn vàng và con sông Hoài lấp lánh hoa đăng về đêm. Nổi tiếng với ẩm thực tinh tế và các làng nghề truyền thống phong phú.",
    image: "assets/img/hoi-an.png",
    lat: 15.8801, lng: 108.338, top: true,
    transportTips: "Bay đến sân bay Quốc tế Đà Nẵng, di chuyển bằng taxi hoặc xe bus khoảng 45 phút. Trong phố cổ, đi bộ hoặc xe đạp.",
    activities: [
      { dayPart: "Sáng", title: "Thưởng thức Cao lầu Phố Hội", tip: "Cao lầu ngon nhất khi được nấu bằng nước giếng cổ Bá Lễ." },
      { dayPart: "Chiều", title: "Đi thúng bơi Rừng dừa Cẩm Thanh", tip: "Chuẩn bị mũ nón vì khu vực này thường xuyên có nắng gắt." },
      { dayPart: "Tối", title: "Thả hoa đăng trên sông Hoài", tip: "Rất đông dịp cuối tuần; cẩn thận tư trang cá nhân." }
    ],
    amusementPlaces: [
      { 
        name: "VinWonders Nam Hội An", 
        image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80", 
        rating: 4.7,
        description: "Lần đầu tiên tại Việt Nam xuất hiện trải nghiệm River Safari - Đi thuyền ngắm động vật hoang dã cực kỳ chân thực cùng Công viên Văn hóa độc đáo.",
        ticketPrice: "600,000 VND",
        openingHours: "09:00 - 20:00",
        address: "Đường Thanh Niên, Bình Minh, Thăng Bình, Quảng Nam"
      },
      { 
        name: "Ký ức Hội An (Hoian Memories Land)", 
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80", 
        rating: 4.9,
        description: "Khu du lịch với show diễn thực cảnh Ký Ức Hội An hoành tráng, tái hiện lịch sử giao thương phồn thịnh của phố cổ Hội An xưa.",
        ticketPrice: "600,000 VND (Vé show)",
        openingHours: "17:00 - 22:00",
        address: "Cồn Ấn Độ, 200 Nguyễn Tri Phương, Cẩm Nam, Hội An, Quảng Nam"
      }
    ],
    accommodations: [
      {
        name: "Anantara Hoi An Resort",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.8,
        description: "Khu nghỉ dưỡng sang trọng bên sông Thu Bồn, mang phong cách kiến trúc Pháp cổ điển.",
        priceRange: "5,000,000 - 10,000,000 VND",
        address: "1 Phạm Hồng Thái, Cẩm Châu, Hội An"
      },
      {
        name: "Four Seasons Resort The Nam Hai",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
        rating: 4.9,
        description: "Một trong những khu nghỉ dưỡng hàng đầu thế giới với bãi biển Hà My riêng tư.",
        priceRange: "15,000,000 - 30,000,000 VND",
        address: "Điện Dương, Điện Bàn, Quảng Nam"
      }
    ],
    diningPlaces: [
      {
        name: "Bánh mì Phượng",
        image: "https://images.unsplash.com/photo-1509722747041-074f18d68246?w=400&q=80",
        rating: 4.6,
        description: "Tiệm bánh mì nổi tiếng thế giới với hương vị đặc trưng truyền thống.",
        priceRange: "20,000 - 40,000 VND",
        address: "2B Phan Chu Trinh, Hội An"
      },
      {
        name: "Nhà hàng Morning Glory",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.5,
        description: "Chuyên phục vụ các món ăn đặc sản Hội An trong không gian nhà cổ ấm cúng.",
        priceRange: "100,000 - 500,000 VND",
        address: "106 Nguyễn Thái Học, Hội An"
      }
    ],
    checkInSpots: [
      {
        name: "Chùa Cầu (Japanese Bridge)",
        image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=400&q=80",
        rating: 4.8,
        description: "Biểu tượng của phố cổ Hội An với kiến trúc pha trộn Nhật - Việt độc đáo.",
        address: "Nguyễn Thị Minh Khai, Hội An"
      },
      {
        name: "Hẻm vàng Hội An",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
        rating: 4.7,
        description: "Những con hẻm nhỏ với bức tường vàng cổ kính là đặc trưng riêng biệt của Hội An.",
        address: "Khu vực Phố cổ Hội An"
      }
    ],
    sourceName: "Quỹ Di sản Hội An",
    sourceUrl: "https://disanhoian.vn/"
  },
  {
    id: "sa-pa",
    name: "Sa Pa",
    region: "Lào Cai",
    tags: ["leo núi", "văn hóa", "ẩm thực"],
    budget: 2, pace: "nhanh",
    habits: ["đi một mình", "gia đình", "đi sớm"],
    interests: ["trekking", "bản làng", "ruộng bậc thang", "check-in"],
    meta: "Thiên đường mây & Ruộng bậc thang kỳ vĩ",
    text: "Thị trấn sương mù Sa Pa làm say lòng người với những đỉnh núi hùng vĩ, ruộng bậc thang uốn lượn và bản sắc văn hóa dân tộc rực rỡ sắc màu Tây Bắc. Fansipan — nóc nhà Đông Dương — là thử thách chinh phục của mọi phượt thủ.",
    image: "assets/img/sa-pa.png",
    lat: 22.3364, lng: 103.8438, top: true,
    transportTips: "Đi xe giường nằm hoặc tàu hỏa đêm cabin giường nằm từ Hà Nội (6-8 tiếng). Sa Pa lạnh quanh năm — luôn mang áo ấm.",
    activities: [
      { dayPart: "Sáng", title: "Chinh phục đỉnh Fansipan (cáp treo)", tip: "Đi cáp treo lúc 8h sáng để có cơ hội săn mây; mang áo ấm." },
      { dayPart: "Chiều", title: "Trekking Bản Cát Cát / Tả Van", tip: "Chuẩn bị giày trekking chống trượt vì đường bản thường dốc và bùn lầy." },
      { dayPart: "Tối", title: "Lẩu cá tầm & Rượu táo mèo", tip: "Cá mú, lẩu gà đen là đặc sản tuyệt hảo giữa không khí lạnh giá." }
    ],
    amusementPlaces: [
      { 
        name: "Sun World Fansipan Legend", 
        image: "https://images.unsplash.com/photo-1544971587-b842c27f8e14?w=400&q=80", 
        rating: 4.9,
        description: "Hệ thống cáp treo đạt kỷ lục Guinness giúp chinh phục đỉnh Fansipan nhanh chóng. Phía trên có quần thể tâm linh khổng lồ trong sương mờ.",
        ticketPrice: "800,000 VND (Vé cáp treo)",
        openingHours: "08:00 - 17:00",
        address: "Đường Nguyễn Chí Thanh, Sa Pa, Lào Cai"
      },
      { 
        name: "Bản Cát Cát", 
        image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80", 
        rating: 4.5,
        description: "Ngôi làng cổ của đồng bào dân tộc Mông rực rỡ nghề truyền thống, bao quanh bởi thác nước trắng xóa.",
        ticketPrice: "150,000 VND",
        openingHours: "06:00 - 18:00",
        address: "Xã San Sả Hồ, Sa Pa, Lào Cai"
      }
    ],
    accommodations: [
      {
        name: "Hotel de la Coupole - MGallery",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.9,
        description: "Kiệt tác kiến trúc kết hợp giữa văn hóa Pháp và sắc màu dân tộc vùng cao.",
        priceRange: "3,500,000 - 7,000,000 VND",
        address: "1 Đường Hoàng Liên, Sa Pa"
      },
      {
        name: "Topas Ecolodge",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
        rating: 4.8,
        description: "Khu nghỉ dưỡng sinh thái nằm trên đỉnh đồi với hồ bơi vô cực view thung lũng tuyệt mỹ.",
        priceRange: "6,000,000 - 12,000,000 VND",
        address: "Thanh Kim, Sa Pa, Lào Cai"
      }
    ],
    diningPlaces: [
      {
        name: "Nhà hàng A Phủ",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.5,
        description: "Nổi tiếng với món Thắng cố và Gà nướng tiêu xanh chuẩn vị Tây Bắc.",
        priceRange: "150,000 - 400,000 VND",
        address: "15 Fansipan, Sa Pa"
      },
      {
        name: "Quán Thắng Cố A Quỳnh",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        rating: 4.3,
        description: "Địa chỉ lâu đời phục vụ thắng cố và các món đặc sản dân tộc.",
        priceRange: "100,000 - 300,000 VND",
        address: "15 Thạch Sơn, Sa Pa"
      }
    ],
    checkInSpots: [
      {
        name: "Đèo Ô Quy Hồ",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
        rating: 4.9,
        description: "Một trong tứ đại đỉnh đèo của Việt Nam, điểm săn mây và ngắm hoàng hôn cực đỉnh.",
        address: "Quốc lộ 4D, giáp ranh Lào Cai - Lai Châu"
      },
      {
        name: "Swing Sapa",
        image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80",
        rating: 4.4,
        description: "Khu phức hợp với nhiều tiểu cảnh sống ảo như tượng đôi tình nhân, xích đu vô cực.",
        address: "87 Nguyễn Chí Thanh, Sa Pa"
      }
    ],
    sourceName: "Cổng Du lịch Lào Cai",
    sourceUrl: "https://laocaitourism.vn/"
  },
  {
    id: "ha-long",
    name: "Vịnh Hạ Long",
    region: "Quảng Ninh",
    tags: ["biển", "văn hóa", "nghỉ dưỡng"],
    budget: 3, pace: "vua",
    habits: ["cặp đôi", "gia đình"],
    interests: ["du thuyền", "kayak", "UNESCO", "check-in"],
    meta: "Kỳ quan thiên nhiên thế giới được UNESCO công nhận",
    text: "Quần thể hàng nghìn đảo đá vôi khổng lồ mọc lên giữa làn nước trong xanh như ngọc bích. Vịnh Hạ Long là di sản thiên nhiên thế giới hai lần được UNESCO công nhận và là biểu tượng du lịch của Việt Nam.",
    image: "assets/img/ha-long.png",
    lat: 20.9101, lng: 107.1839, top: true,
    transportTips: "Đi cao tốc Hà Nội - Hải Phòng - Quảng Ninh rút ngắn thời gian di chuyển còn khoảng 2-2.5 giờ. Nên đặt tour du thuyền từ 1-3 đêm.",
    activities: [
      { dayPart: "Sáng", title: "Khám phá Hang Sửng Sốt / Động Thiên Cung", tip: "Đặt tham quan theo giờ, tránh đông người vào buổi trưa." },
      { dayPart: "Chiều", title: "Chèo thuyền Kayak hang Luồn & Tùng Áng", tip: "Cẩn thận với khỉ hoang; mặc áo phao đúng cách." },
      { dayPart: "Tối", title: "Nghỉ ngơi trên Du thuyền 5 sao", tip: "Thưởng thức bữa tối hải sản và câu mực đêm trên boong." }
    ],
    amusementPlaces: [
      {
        name: "Sun World Ha Long",
        image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80",
        rating: 4.8,
        description: "Tổ hợp vui chơi giải trí hàng đầu với vòng quay Mặt trời và các trò chơi cảm giác mạnh.",
        ticketPrice: "350,000 - 700,000 VND",
        openingHours: "09:00 - 22:00",
        address: "Bãi Cháy, Hạ Long, Quảng Ninh"
      }
    ],
    accommodations: [
      {
        name: "Vinpearl Resort & Spa Ha Long",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.7,
        description: "Khu nghỉ dưỡng nằm biệt lập trên đảo Rều với tầm nhìn 360 độ ra vịnh Hạ Long.",
        priceRange: "3,000,000 - 6,000,000 VND",
        address: "Đảo Rều, Bãi Cháy, Hạ Long"
      },
      {
        name: "Du thuyền Ambassador Cruise",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
        rating: 4.9,
        description: "Trải nghiệm nghỉ đêm trên du thuyền 6 sao sang trọng giữa lòng di sản.",
        priceRange: "4,000,000 - 10,000,000 VND",
        address: "Cảng tàu quốc tế Hạ Long"
      }
    ],
    diningPlaces: [
      {
        name: "Nhà hàng Hồng Hạnh 3",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.6,
        description: "Địa chỉ hải sản nổi tiếng bậc nhất Hạ Long với không gian hiện đại và đồ ăn tươi ngon.",
        priceRange: "400,000 - 1,200,000 VND",
        address: "50 Hạ Long, Bãi Cháy, Hạ Long"
      },
      {
        name: "Sữa chua trân chân Hạ Long (Cơ sở 1)",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        rating: 4.5,
        description: "Món ăn vặt đặc sản giải nhiệt nổi tiếng toàn quốc khởi nguồn từ đây.",
        priceRange: "20,000 - 50,000 VND",
        address: "Cổng chợ Hạ Long 1"
      }
    ],
    checkInSpots: [
      {
        name: "Núi Bài Thơ",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
        rating: 4.8,
        description: "Điểm ngắm toàn cảnh vịnh Hạ Long từ trên cao đẹp nhất (lưu ý kiểm tra tình trạng lối lên).",
        address: "Hồng Gai, Hạ Long"
      },
      {
        name: "Bảo tàng Quảng Ninh",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
        rating: 4.7,
        description: "Viên ngọc đen bên bờ vịnh với kiến trúc độc đáo, là điểm check-in không thể bỏ qua.",
        address: "Trần Quốc Nghiễn, Hạ Long"
      }
    ],
    sourceName: "Ban Quản lý Vịnh Hạ Long",
    sourceUrl: "https://halong.org.vn/"
  },
  {
    id: "ha-noi",
    name: "Hà Nội",
    region: "Thủ đô",
    tags: ["ẩm thực", "văn hóa"],
    budget: 1, pace: "cham",
    habits: ["cú đêm", "đi một mình", "cặp đôi"],
    interests: ["phố cổ", "cà phê", "bảo tàng", "ẩm thực đường phố"],
    meta: "Thủ đô nghìn năm văn hiến & Ẩm thực đường phố",
    text: "Hà Nội pha trộn giữa lịch sử hàng ngàn năm tại 36 phố phường và cuộc sống hiện đại tất bật, nổi danh toàn cầu bởi ẩm thực đường phố phong phú từ phở, bún chả đến cà phê trứng độc đáo.",
    image: "assets/img/ha-noi.png",
    lat: 21.0285, lng: 105.8542, top: false,
    transportTips: "Đường Hà Nội khá hẹp ở khu Phố cổ. Nên đi bộ hoặc sử dụng ứng dụng ride-hailing như Grab, Be để di chuyển thuận tiện.",
    activities: [
      { dayPart: "Sáng", title: "Tham quan Văn Miếu - Quốc Tử Giám", tip: "Đến sớm trước 8h để không gian vắng lặng và phù hợp chụp ảnh." },
      { dayPart: "Chiều", title: "Nhâm nhi Cà phê Trứng phố Đinh Tiên Hoàng", tip: "Cà phê Giang là địa chỉ nổi tiếng nhất; ngồi tầng 2 để ngắm phố cổ." },
      { dayPart: "Tối", title: "Bia hơi vỉa hè tại Tạ Hiện / Lương Ngọc Quyến", tip: "Phố mở nhộn nhịp đến 1h sáng. Cẩn thận tư trang cá nhân." }
    ],
    amusementPlaces: [
      {
        name: "VinKE & Vinpearl Aquarium",
        image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80",
        rating: 4.6,
        description: "Thủy cung lớn nhất Hà Nội với hàng ngàn sinh vật biển và khu vui chơi giáo dục cho trẻ em.",
        ticketPrice: "170,000 - 250,000 VND",
        openingHours: "10:00 - 22:00",
        address: "Vincom Mega Mall Times City, 458 Minh Khai"
      }
    ],
    accommodations: [
      {
        name: "Sofitel Legend Metropole Hanoi",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.9,
        description: "Khách sạn cổ điển sang trọng bậc nhất với lịch sử hơn 100 năm.",
        priceRange: "6,000,000 - 15,000,000 VND",
        address: "15 Ngô Quyền, Hoàn Kiếm, Hà Nội"
      },
      {
        name: "Lotte Hotel Hanoi",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
        rating: 4.8,
        description: "Nằm trên những tầng cao nhất của tòa tháp Lotte, view toàn cảnh thành phố.",
        priceRange: "3,500,000 - 6,000,000 VND",
        address: "54 Liễu Giai, Ba Đình, Hà Nội"
      }
    ],
    diningPlaces: [
      {
        name: "Phở Thìn Lò Đúc",
        image: "https://images.unsplash.com/photo-1509722747041-074f18d68246?w=400&q=80",
        rating: 4.4,
        description: "Bát phở bò tái lăn trứ danh với nhiều hành lá, mang đậm hương vị Hà Nội.",
        priceRange: "60,000 - 100,000 VND",
        address: "13 Lò Đúc, Hai Bà Trưng, Hà Nội"
      },
      {
        name: "Bún Chả Hương Liên (Bún chả Obama)",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.5,
        description: "Nơi Tổng thống Obama từng thưởng thức bún chả khi đến Việt Nam.",
        priceRange: "50,000 - 150,000 VND",
        address: "24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội"
      }
    ],
    checkInSpots: [
      {
        name: "Phố đường tàu Phùng Hưng",
        image: "https://images.unsplash.com/photo-1502602898657-3e9172f29b78?w=400&q=80",
        rating: 4.5,
        description: "Cung đường sắt xuyên qua khu dân cư với các quán cà phê sát cạnh đường ray.",
        address: "Phùng Hưng, Hoàn Kiếm, Hà Nội"
      },
      {
        name: "Nhà Thờ Lớn Hà Nội",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
        rating: 4.7,
        description: "Kiến trúc Gothic cổ điển, là trung tâm sinh hoạt công giáo lớn nhất thủ đô.",
        address: "40 Nhà Chung, Hoàn Kiếm, Hà Nội"
      }
    ],
    sourceName: "Vietnam.Travel - Cục Du lịch Quốc gia Việt Nam",
    sourceUrl: "https://vietnam.travel/places-to-go/northern-vietnam/ha-noi"
  },
  {
    id: "da-lat",
    name: "Đà Lạt",
    region: "Lâm Đồng",
    tags: ["leo núi", "ẩm thực", "nghỉ dưỡng"],
    budget: 2, pace: "cham",
    habits: ["cặp đôi", "gia đình"],
    interests: ["hoa", "cà phê", "thiên nhiên", "check-in"],
    meta: "Thành phố ngàn hoa & Khí hậu mát mẻ quanh năm",
    text: "Thành phố Đà Lạt nằm trên cao nguyên Langbiang mát mẻ, nổi tiếng với những vườn hoa bát ngát, đồi chè xanh mướt, kiến trúc Pháp cổ điển và nền cà phê specialty nức tiếng.",
    image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&q=80",
    lat: 11.9404, lng: 108.4583, top: true,
    transportTips: "Xe khách giường nằm từ TP.HCM (6-7 tiếng) hoặc bay đến sân bay Liên Khương. Đà Lạt dốc — thuê xe máy cần kinh nghiệm lái núi.",
    activities: [
      { dayPart: "Sáng", title: "Đồi chè Cầu Đất & Vườn dâu tây", tip: "Sương sớm tan lúc 8-9h — mang áo khoác mỏng dù là mùa hè." },
      { dayPart: "Chiều", title: "Hồ Tuyền Lâm, đạp xe / kayak", tip: "Tránh hẻm xe tay ga dốc lần đầu; đường quanh hồ rất đẹp và an toàn." },
      { dayPart: "Tối", title: "Chợ đêm Đà Lạt & ăn vặt", tip: "Kem bơ, bánh tráng nướng, sữa đậu nành nóng — thưởng thức đặc sản giá rẻ." }
    ],
    accommodations: [
      {
        name: "Ana Mandara Villas Dalat Resort & Spa",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.8,
        description: "Quần thể biệt thự Pháp cổ nằm ẩn mình giữa rừng thông xanh mướt.",
        priceRange: "2,500,000 - 5,000,000 VND",
        address: "Lê Lai, Phường 5, Đà Lạt"
      },
      {
        name: "Dalat Edensee Lake Resort & Spa",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
        rating: 4.7,
        description: "Tọa lạc bên bờ hồ Tuyền Lâm thơ mộng với phong cách kiến trúc Đức sang trọng.",
        priceRange: "3,000,000 - 7,000,000 VND",
        address: "Hồ Tuyền Lâm, Đà Lạt"
      }
    ],
    diningPlaces: [
      {
        name: "Lẩu gà lá é Tao Ngộ",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.5,
        description: "Món lẩu đặc trưng không thể bỏ qua khi đến Đà Lạt, nước dùng thanh ngọt thơm mùi lá é.",
        priceRange: "200,000 - 400,000 VND",
        address: "05 Đường 3/4, Đà Lạt"
      },
      {
        name: "Tiệm cà phê Túi Mơ To",
        image: "https://images.unsplash.com/photo-1509722747041-074f18d68246?w=400&q=80",
        rating: 4.7,
        description: "Quán cà phê kính nổi tiếng với vườn cúc họa mi và view toàn cảnh thung lũng.",
        priceRange: "50,000 - 100,000 VND",
        address: "Hẻm 31 Sào Nam, Đà Lạt"
      }
    ],
    checkInSpots: [
      {
        name: "Quảng trường Lâm Viên",
        image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=400&q=80",
        rating: 4.6,
        description: "Biểu tượng của thành phố với nụ hoa Atiso và đóa hoa Dã Quỳ khổng lồ bằng kính.",
        address: "Đường Trần Quốc Toản, Đà Lạt"
      },
      {
        name: "Ga Đà Lạt",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80",
        rating: 4.7,
        description: "Nhà ga cổ nhất Đông Dương với kiến trúc răng cưa độc đáo từ thời Pháp.",
        address: "Quang Trung, Đà Lạt"
      }
    ],
    sourceName: "Cổng Du lịch Lâm Đồng",
    sourceUrl: "https://lamdong.gov.vn/Sites/vi-vn/Pages/default.aspx"
  },
  {
    id: "da-nang",
    name: "Đà Nẵng",
    region: "Đà Nẵng",
    tags: ["biển", "ẩm thực", "văn hóa"],
    budget: 2, pace: "vua",
    habits: ["gia đình", "cặp đôi"],
    interests: ["biển", "cầu Vàng", "ẩm thực", "resort"],
    meta: "Thành phố đáng sống & Biển Mỹ Khê tuyệt đẹp",
    text: "Đà Nẵng được mệnh danh là thành phố đáng sống nhất Việt Nam với biển Mỹ Khê trong xanh, cơ sở hạ tầng hiện đại, Bà Nà Hills kỳ thú và ẩm thực miền Trung phong phú.",
    image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80",
    lat: 16.0544, lng: 108.2022, top: false,
    transportTips: "Sân bay Quốc tế Đà Nẵng nằm rất gần trung tâm (5-10 phút). Thuê xe máy hoặc dùng Grab để di chuyển trong thành phố.",
    activities: [
      { dayPart: "Sáng", title: "Tắm biển Mỹ Khê / Ngũ Hành Sơn", tip: "Nắng mạnh từ 10h-14h — bôi kem chống nắng kỹ; bãi biển có cờ an toàn." },
      { dayPart: "Chiều", title: "Bà Nà Hills & Cầu Vàng (Golden Bridge)", tip: "Mát hơn trung tâm 8-10°C; mang áo khoác nhẹ để chụp ảnh Cầu Vàng." },
      { dayPart: "Tối", title: "Cầu Rồng phun lửa & Chợ Hàn", tip: "Cầu phun lửa lúc 21h thứ 7 và Chủ Nhật. Đến trước 30p chọn vị trí đứng đẹp." }
    ],
    amusementPlaces: [
      {
        name: "Sun World Ba Na Hills",
        image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80",
        rating: 4.9,
        description: "Chốn bồng lai tiên cảnh với Cầu Vàng nổi tiếng thế giới và làng Pháp cổ kính.",
        ticketPrice: "900,000 VND",
        openingHours: "08:00 - 22:00",
        address: "Hòa Vang, Đà Nẵng"
      }
    ],
    accommodations: [
      {
        name: "InterContinental Danang Sun Peninsula Resort",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 5.0,
        description: "Khu nghỉ dưỡng sang trọng bậc nhất nằm tựa lưng vào bán đảo Sơn Trà.",
        priceRange: "12,000,000 - 25,000,000 VND",
        address: "Bán đảo Sơn Trà, Đà Nẵng"
      },
      {
        name: "Hilton Da Nang",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
        rating: 4.7,
        description: "Vị trí đắc địa ngay bờ sông Hàn, thuận tiện di chuyển đến các điểm tham quan.",
        priceRange: "2,500,000 - 5,000,000 VND",
        address: "50 Bạch Đằng, Đà Nẵng"
      }
    ],
    diningPlaces: [
      {
        name: "Mì Quảng Bà Mua",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        rating: 4.5,
        description: "Hệ thống mì Quảng gia truyền nổi tiếng nhất Đà Thành.",
        priceRange: "40,000 - 80,000 VND",
        address: "95A Nguyễn Tri Phương, Đà Nẵng"
      }
    ],
    checkInSpots: [
      {
        name: "Cầu Vàng (Golden Bridge)",
        image: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80",
        rating: 4.9,
        description: "Biểu tượng du lịch mới của Việt Nam với đôi bàn tay đá khổng lồ nâng đỡ dải lụa vàng.",
        address: "Sun World Ba Na Hills"
      }
    ],
    sourceName: "Cổng Thông tin Du lịch Đà Nẵng",
    sourceUrl: "https://danangfantasticity.com/"
  },
  {
    id: "nha-trang",
    name: "Nha Trang",
    region: "Khánh Hòa",
    tags: ["biển", "ẩm thực"],
    budget: 2, pace: "vua",
    habits: ["cặp đôi", "gia đình", "cú đêm"],
    interests: ["lặn", "đảo", "resort", "ẩm thực"],
    meta: "Thành phố biển & Hệ thống đảo san hô phong phú",
    text: "Nha Trang sở hữu vùng biển trong xanh với hệ thống rạn san hô đa dạng bậc nhất Việt Nam, cùng chuỗi đảo hoang sơ thơ mộng và nền ẩm thực biển cực kỳ đặc sắc.",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    lat: 12.2388, lng: 109.1967, top: false,
    transportTips: "Bay đến sân bay Quốc tế Cam Ranh, xe shuttle/bus vào trung tâm khoảng 30-45 phút. Chú ý cờ an toàn khi tắm biển.",
    activities: [
      { dayPart: "Sáng", title: "Tham quan Tháp Bà Ponagar cổ kính", tip: "Đi sớm tránh đoàn tour; váy ngắn cần sarong khi vào khu thánh tích." },
      { dayPart: "Chiều", title: "Tour 4 đảo hoặc VinWonders Nha Trang", tip: "Đặt tour online để có giá tốt; kiểm tra thời tiết biển trước." },
      { dayPart: "Tối", title: "Hải sản tươi sống tại đường biển Trần Phú", tip: "Hỏi giá/kg trước khi chọn; bạch tuộc, ghẹ, tôm hùm là đặc sản." }
    ],
    amusementPlaces: [
      {
        name: "VinWonders Nha Trang",
        image: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&q=80",
        rating: 4.8,
        description: "Công viên giải trí của những kỷ lục, tọa lạc trên đảo Hòn Tre tuyệt đẹp.",
        ticketPrice: "800,000 VND",
        openingHours: "08:00 - 20:00",
        address: "Đảo Hòn Tre, Nha Trang"
      }
    ],
    accommodations: [
      {
        name: "Amiana Resort Nha Trang",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.8,
        description: "Nổi tiếng với hồ bơi nước mặn và bãi tắm riêng yên tĩnh.",
        priceRange: "4,000,000 - 8,000,000 VND",
        address: "Phạm Văn Đồng, Nha Trang"
      }
    ],
    diningPlaces: [
      {
        name: "Nem nướng Đặng Văn Quyên",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.4,
        description: "Quán nem nướng Ninh Hòa trừng danh tại Nha Trang.",
        priceRange: "50,000 - 150,000 VND",
        address: "16A Lãn Ông, Nha Trang"
      }
    ],
    checkInSpots: [
      {
        name: "Tháp Bà Ponagar",
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80",
        rating: 4.7,
        description: "Quần thể kiến trúc Chăm Pa lớn nhất miền Trung.",
        address: "2 Tháng 4, Vĩnh Phước, Nha Trang"
      }
    ],
    sourceName: "Cổng Du lịch Khánh Hòa",
    sourceUrl: "https://khanhhoa.gov.vn/"
  },
  {
    id: "can-tho",
    name: "Cần Thơ",
    region: "TP. Cần Thơ",
    tags: ["văn hóa", "ẩm thực"],
    budget: 1, pace: "cham",
    habits: ["đi một mình", "gia đình"],
    interests: ["miệt vườn", "chợ nổi", "sông nước", "ẩm thực"],
    meta: "Thủ phủ miền Tây & Chợ nổi Cái Răng nổi tiếng",
    text: "Cần Thơ là trái tim của đồng bằng sông Cửu Long, nơi văn hóa sông nước, chợ nổi tấp nập và vườn cây ăn trái xanh mát tạo nên bức tranh miền Tây Nam Bộ đặc sắc.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    lat: 10.0452, lng: 105.7469, top: false,
    transportTips: "Từ TP.HCM đi xe limousine khoảng 3-4 tiếng. Chợ nổi Cái Răng họp lúc 5h30-7h — nghỉ gần bến phà để kịp giờ.",
    activities: [
      { dayPart: "Sáng", title: "Chợ nổi Cái Răng lúc bình minh", tip: "Thuê ghe nhỏ có người lái để linh hoạt; chuẩn bị tiền mặt lẻ mua đồ ăn." },
      { dayPart: "Chiều", title: "Nhà cổ Bình Thủy & Vườn trái cây Phong Điền", tip: "Ăn trái cây đúng mùa; hỏi giá vé tham quan trước." },
      { dayPart: "Tối", title: "Bến Ninh Kiều ngắm sông & Lẩu mắm đặc sản", tip: "Thử lẩu mắm sông nước trong nhóm đông vì dễ chia sẻ nhiều món." }
    ],
    accommodations: [
      {
        name: "Azerai Can Tho",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.9,
        description: "Khu nghỉ dưỡng 5 sao nằm biệt lập trên Cồn Ấu thơ mộng.",
        priceRange: "5,000,000 - 10,000,000 VND",
        address: "Cồn Ấu, Hưng Phú, Cái Răng, Cần Thơ"
      }
    ],
    diningPlaces: [
      {
        name: "Lẩu mắm Dạ Lý",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.6,
        description: "Nơi thưởng thức lẩu mắm chuẩn vị miền Tây bậc nhất Cần Thơ.",
        priceRange: "300,000 - 600,000 VND",
        address: "89 Đường 3/2, Ninh Kiều, Cần Thơ"
      }
    ],
    checkInSpots: [
      {
        name: "Bến Ninh Kiều",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
        rating: 4.8,
        description: "Điểm tham quan nổi tiếng nhất Cần Thơ, đẹp lung linh về đêm.",
        address: "Hai Bà Trưng, Tân An, Ninh Kiều, Cần Thơ"
      }
    ],
    sourceName: "Cổng TTĐT TP. Cần Thơ",
    sourceUrl: "https://cantho.gov.vn/"
  },
  {
    id: "ninh-binh",
    name: "Ninh Bình",
    region: "Ninh Bình",
    tags: ["leo núi", "văn hóa"],
    budget: 1, pace: "cham",
    habits: ["gia đình", "cặp đôi", "đi một mình"],
    interests: ["trekking", "hang động", "UNESCO", "chùa"],
    meta: "Vịnh Hạ Long trên cạn & Quần thể Di sản Tràng An",
    text: "Ninh Bình là 'Vịnh Hạ Long trên cạn' với hệ thống núi đá vôi, sông nước và hang động tuyệt đẹp. Tràng An được UNESCO công nhận là Di sản Thế giới kép về cả văn hóa lẫn thiên nhiên.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    lat: 20.2506, lng: 105.9745, top: true,
    transportTips: "Cách Hà Nội khoảng 100km, đi xe limousine khoảng 2 tiếng. Tại Ninh Bình, xe đạp thuê là cách lý tưởng nhất để khám phá.",
    activities: [
      { dayPart: "Sáng", title: "Chèo thuyền xuyên hang đá Tràng An", tip: "Mất 2.5-3 tiếng. Đi sớm ít đông; góc ảnh điện ảnh tuyệt vời." },
      { dayPart: "Chiều", title: "Leo 500 bậc thang Hang Múa ngắm toàn cảnh", tip: "Mang giày đế bám; leo khoảng 15-20p nhưng xứng đáng với cảnh đỉnh núi." },
      { dayPart: "Tối", title: "Thưởng thức Dê núi Ninh Bình & Cơm cháy", tip: "Dê xào sả ớt, tái chanh — hỏi quán địa phương gần khách sạn để tìm chỗ ngon." }
    ],
    accommodations: [
      {
        name: "Emeralda Resort Ninh Binh",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.7,
        description: "Tái hiện không gian làng quê Bắc Bộ xưa với dịch vụ nghỉ dưỡng cao cấp.",
        priceRange: "2,000,000 - 4,000,000 VND",
        address: "Khu bảo tồn Vân Long, Gia Viễn, Ninh Bình"
      }
    ],
    diningPlaces: [
      {
        name: "Nhà hàng Chính Thư",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.5,
        description: "Chuyên các món dê núi Ninh Bình nổi tiếng, được nhiều du khách lựa chọn.",
        priceRange: "200,000 - 500,000 VND",
        address: "Khê Thượng, Ninh Xuân, Hoa Lư, Ninh Bình"
      }
    ],
    checkInSpots: [
      {
        name: "Hang Múa",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
        rating: 4.8,
        description: "Điểm check-in 'quốc dân' với view nhìn xuống Tam Cốc từ đỉnh núi Ngọa Long.",
        address: "Khê Đầu Hạ, Ninh Xuân, Hoa Lư"
      }
    ],
    sourceName: "Du lịch Ninh Bình chính thức",
    sourceUrl: "https://ninhbinhtourist.com.vn/"
  },
  {
    id: "hue",
    name: "Huế",
    region: "Thừa Thiên - Huế",
    tags: ["văn hóa", "ẩm thực"],
    budget: 1, pace: "cham",
    habits: ["cặp đôi", "đi một mình"],
    interests: ["cố đô", "lăng tẩm", "ẩm thực cung đình", "UNESCO"],
    meta: "Cố đô lăng tẩm & Ẩm thực Cung đình độc đáo",
    text: "Cố đô Huế gắn liền với triều đại nhà Nguyễn, ẩn chứa hệ thống lăng tẩm nguy nga, cung đình hoành tráng và nền ẩm thực cung đình tinh tế được UNESCO vinh danh.",
    image: "assets/img/hue.png",
    lat: 16.4637, lng: 107.5909, top: false,
    transportTips: "Bay đến sân bay Phú Bài hoặc đi tàu hỏa. Thuê xe máy để thoải mái tham quan các lăng tẩm ở ngoại ô.",
    activities: [
      { dayPart: "Sáng", title: "Tham quan Hoàng Thành & Đại Nội Huế", tip: "Mặc kín đáo khi vào điện thờ; đi sớm tránh đoàn khách du lịch đông đúc." },
      { dayPart: "Chiều", title: "Lăng Khải Định & Lăng Minh Mạng", tip: "Thuê xe máy hoặc xe ôm để đi hết loạt lăng trong 1 ngày." },
      { dayPart: "Tối", title: "Chợ Đông Ba & Bún bò Huế chuẩn vị", tip: "Bún bò Ngự Bình hoặc O Xuân là những địa chỉ được người Huế yêu thích." }
    ],
    accommodations: [
      {
        name: "Azerai La Residence, Hue",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.9,
        description: "Tòa dinh thự cổ bên dòng sông Hương mang vẻ đẹp nghệ thuật Art Deco.",
        priceRange: "4,500,000 - 8,000,000 VND",
        address: "5 Lê Lợi, Vĩnh Ninh, Huế"
      }
    ],
    diningPlaces: [
      {
        name: "Bún Bò Huế O Xuân",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        rating: 4.6,
        description: "Địa chỉ thưởng thức bún bò Huế chuẩn vị được người dân bản địa yêu thích.",
        priceRange: "40,000 - 70,000 VND",
        address: "17 Lý Thường Kiệt, Huế"
      }
    ],
    checkInSpots: [
      {
        name: "Đại Nội Huế",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80",
        rating: 4.8,
        description: "Quần thể di tích lịch sử với kiến trúc cung đình hoành tráng.",
        address: "Phú Hậu, Huế"
      }
    ],
    sourceName: "Trung tâm Bảo tồn Di tích Cố đô Huế",
    sourceUrl: "https://hueworldheritage.org.vn/"
  },
  {
    id: "ha-giang",
    name: "Hà Giang",
    region: "Hà Giang",
    tags: ["leo núi", "văn hóa"],
    budget: 1, pace: "nhanh",
    habits: ["đi một mình", "đi sớm"],
    interests: ["trekking", "moto", "bản làng", "check-in"],
    meta: "Cung đường đèo hiểm trở & Hoa tam giác mạch bất tận",
    text: "Hà Giang — tỉnh địa đầu Tổ quốc — chinh phục mọi phượt thủ với cung đường Mã Pí Lèng huyền thoại, Đồng Văn Cổ Trấn cổ kính và mùa hoa tam giác mạch tím ngát tháng 10-11.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    lat: 23.2241, lng: 104.9834, top: true,
    transportTips: "Xe khách từ Hà Nội khoảng 7-8 tiếng. Thuê moto tại thị xã Hà Giang hoặc đặt off-road tour có guide kinh nghiệm.",
    activities: [
      { dayPart: "Sáng", title: "Cột cờ Lũng Cú — Điểm cực Bắc Việt Nam", tip: "Leo 389 bậc; ảnh cờ đỏ Tổ quốc lúc bình minh cực đẹp và đáng nhớ." },
      { dayPart: "Chiều", title: "Đèo Mã Pí Lèng — Con đèo hùng vĩ nhất VN", tip: "Lái xe cực cẩn thận; đường hẹp, vực sâu hàng trăm mét." },
      { dayPart: "Tối", title: "Chợ đêm Đồng Văn Cổ Trấn", tip: "Thử Mèn mén, Thắng cố ngựa — đặc sản dân tộc vùng cao khó quên." }
    ],
    accommodations: [
      {
        name: "H'Mong Village Resort",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.8,
        description: "Nghỉ dưỡng trong những căn nhà hình chiếc quẩy tấu độc đáo của người Mông.",
        priceRange: "1,500,000 - 3,500,000 VND",
        address: "Khu Tráng Kìm, Quyết Tiến, Quản Bạ, Hà Giang"
      }
    ],
    diningPlaces: [
      {
        name: "Cháo ấu tẩu Hương",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.5,
        description: "Món cháo độc đáo gắn liền với vùng cao núi đá Hà Giang.",
        priceRange: "40,000 - 60,000 VND",
        address: "Thị xã Hà Giang (gần quảng trường)"
      }
    ],
    checkInSpots: [
      {
        name: "Dốc Thẩm Mã",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
        rating: 4.9,
        description: "Cung đường đèo chín khoanh uốn lượn đẹp mắt, điểm chụp ảnh mang tính biểu tượng.",
        address: "Quốc lộ 4C, Hà Giang"
      }
    ],
    sourceName: "Cổng TTĐT Tỉnh Hà Giang",
    sourceUrl: "https://hagiang.gov.vn/"
  },
  {
    id: "con-dao",
    name: "Côn Đảo",
    region: "Bà Rịa - Vũng Tàu",
    tags: ["biển", "nghỉ dưỡng"],
    budget: 3, pace: "cham",
    habits: ["cặp đôi", "đi một mình"],
    interests: ["biển hoang", "rùa biển", "lịch sử", "lặn biển"],
    meta: "Thiên đường biển hoang nguyên sơ & Di tích lịch sử",
    text: "Côn Đảo còn lưu giữ vẻ nguyên sơ hiếm có với những bãi biển hoang vắng tuyệt đẹp, vườn quốc gia với rừng nguyên sinh và trải nghiệm xem rùa biển đẻ trứng độc đáo.",
    image: "https://images.unsplash.com/photo-1415399153348-c05e9599f298?w=800&q=80",
    lat: 8.6914, lng: 106.6061, top: true,
    transportTips: "Bay từ TP.HCM hoặc Cần Thơ khoảng 50 phút. Thuê xe máy trên đảo để tham quan. Mùa rùa đẻ trứng: tháng 5-10.",
    activities: [
      { dayPart: "Sáng", title: "Bãi Đầm Trầu / Bãi Ông Đụng hoang sơ", tip: "Nước trong xanh; mang đồ snorkel riêng để khám phá san hô gần bờ." },
      { dayPart: "Chiều", title: "Vườn Quốc gia Côn Đảo — Khu bảo tồn", tip: "Đăng ký xem rùa biển về đêm tại Ban quản lý VQG từ sáng sớm." },
      { dayPart: "Tối", title: "Thăm Nghĩa trang Hàng Dương linh thiêng", tip: "Không gian trang nghiêm; trang phục lịch sự và không chụp ảnh tuỳ tiện." }
    ],
    accommodations: [
      {
        name: "Six Senses Con Dao",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
        rating: 5.0,
        description: "Khu nghỉ dưỡng siêu sang trọng, thân thiện môi trường bậc nhất Côn Đảo.",
        priceRange: "15,000,000 - 40,000,000 VND",
        address: "Bãi Đất Dốc, Côn Đảo"
      }
    ],
    diningPlaces: [
      {
        name: "Ốc Vú Nàng Côn Đảo",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.6,
        description: "Thưởng thức hải sản tươi sống đặc trưng của đảo đại dương.",
        priceRange: "200,000 - 500,000 VND",
        address: "Khu vực chợ đêm Côn Đảo"
      }
    ],
    checkInSpots: [
      {
        name: "Bãi Đầm Trầu",
        image: "https://images.unsplash.com/photo-1415399153348-c05e9599f298?w=400&q=80",
        rating: 4.8,
        description: "Bãi biển đẹp nhất Côn Đảo, nổi tiếng với khoảnh khắc máy bay hạ cánh ngay sát đầu.",
        address: "Gần sân bay Cỏ Ống, Côn Đảo"
      }
    ],
    sourceName: "Vườn Quốc gia Côn Đảo",
    sourceUrl: "https://vuondaocon.com.vn/"
  },
  {
    id: "quy-nhon",
    name: "Quy Nhơn",
    region: "Bình Định",
    tags: ["biển", "văn hóa"],
    budget: 1, pace: "cham",
    habits: ["đi một mình", "cặp đôi"],
    interests: ["biển vắng", "Chăm Pa", "hải sản rẻ", "bình yên"],
    meta: "Biển đẹp yên bình & Tháp Chăm cổ kính",
    text: "Quy Nhơn là viên ngọc ẩn của du lịch Việt Nam — biển Kỳ Co trong vắt như ngọc bích, tháp Chăm cổ kính hàng ngàn năm tuổi và ẩm thực hải sản siêu tươi với giá bình dân.",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
    lat: 13.7765, lng: 109.2235, top: false,
    transportTips: "Bay thẳng đến sân bay Phù Cát. Grab tại Quy Nhơn rẻ hơn so với các TP lớn; thuê xe máy để đi Kỳ Co, Hòn Khô.",
    activities: [
      { dayPart: "Sáng", title: "Bãi Kỳ Co & Hòn Khô hoang sơ", tip: "Đặt thuyền từ bến Ca Nam từ 6h sáng; nước trong xanh nhất buổi sáng sớm." },
      { dayPart: "Chiều", title: "Tháp Đôi & Tháp Bánh Ít - Di sản Chăm Pa", tip: "Tham quan miễn phí hoặc vé giá thấp; mang nón rộng vành vì trời nắng." },
      { dayPart: "Tối", title: "Bún chả cá & Chợ đêm ẩm thực Quy Nhơn", tip: "Hải sản cực tươi và giá rất bình dân so với các điểm du lịch khác." }
    ],
    accommodations: [
      {
        name: "FLC City Hotel Beach Quy Nhon",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.7,
        description: "Khách sạn hiện đại ngay mặt biển với phong cách phục vụ chuyên nghiệp.",
        priceRange: "1,500,000 - 3,000,000 VND",
        address: "11 An Dương Vương, Quy Nhơn"
      }
    ],
    diningPlaces: [
      {
        name: "Nhà hàng Hải Sỹ",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.5,
        description: "Địa chỉ hải sản tươi sống nổi tiếng với món tôm hùm chuẩn vị Quy Nhơn.",
        priceRange: "300,000 - 800,000 VND",
        address: "35B Nguyễn Huệ, Quy Nhơn"
      }
    ],
    checkInSpots: [
      {
        name: "Eo Gió",
        image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&q=80",
        rating: 4.9,
        description: "Được mệnh danh là nơi ngắm hoàng hôn đẹp nhất Việt Nam với con đường đi bộ ven biển.",
        address: "Nhơn Lý, Quy Nhơn"
      }
    ],
    sourceName: "Cổng TTĐT Tỉnh Bình Định",
    sourceUrl: "https://binhdinh.gov.vn/"
  },
  {
    id: "phan-thiet",
    name: "Mũi Né – Phan Thiết",
    region: "Bình Thuận",
    tags: ["biển", "ẩm thực", "nghỉ dưỡng"],
    budget: 2, pace: "cham",
    habits: ["cặp đôi", "gia đình"],
    interests: ["biển", "đồi cát", "kitesurfing", "resort"],
    meta: "Đồi cát đỏ kỳ ảo & Thiên đường kite-surfing",
    text: "Mũi Né nổi bật với những đồi cát đỏ và trắng kỳ ảo trải dài, bãi biển ít người và gió lộng quanh năm biến nơi đây thành thiên đường cho môn kite-surfing và windsurfing.",
    image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800&q=80",
    lat: 10.9804, lng: 108.2591, top: false,
    transportTips: "Xe khách/tàu hỏa từ TP.HCM khoảng 4 tiếng. Hoặc bay đến Phan Thiết (sân bay mới). Nhiều resort có xe đón từ TP.HCM.",
    activities: [
      { dayPart: "Sáng", title: "Đồi Cát Đỏ / Bàu Trắng lúc bình minh", tip: "Đến lúc 5h30-7h để chụp ảnh đẹp nhất; tránh trưa nóng có thể lên tới 40°C." },
      { dayPart: "Chiều", title: "Kite-surf / Tắm biển Mũi Né", tip: "Mùa gió Đông Bắc (tháng 10-4) là thời điểm tốt nhất cho kite-surfing." },
      { dayPart: "Tối", title: "Chợ hải sản Phan Thiết tươi sống", tip: "Ghẹ, tôm hùm, mực — hỏi giá rõ ràng /con hoặc /kg trước khi chọn." }
    ],
    accommodations: [
      {
        name: "Centara Mirage Resort Mui Ne",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
        rating: 4.8,
        description: "Khu nghỉ dưỡng phức hợp theo phong cách Địa Trung Hải với công viên nước hiện đại.",
        priceRange: "2,500,000 - 5,500,000 VND",
        address: "Huỳnh Thúc Kháng, Mũi Né, Phan Thiết"
      }
    ],
    diningPlaces: [
      {
        name: "Lẩu thả Mũi Né - Seahorse Bistro",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.6,
        description: "Món lẩu thả trứ danh mang đậm nét văn hóa ẩm thực Bình Thuận.",
        priceRange: "200,000 - 500,000 VND",
        address: "Km 11 Nguyễn Đình Chiểu, Mũi Né"
      }
    ],
    checkInSpots: [
      {
        name: "Bàu Trắng (Mui Ne White Sand Dunes)",
        image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=400&q=80",
        rating: 4.9,
        description: "Tiểu sa mạc Sahara của Việt Nam với những triền cát trắng xóa và hồ sen mát lành.",
        address: "Hòa Thắng, Bắc Bình, Bình Thuận"
      }
    ],
    sourceName: "Cổng TTĐT Tỉnh Bình Thuận",
    sourceUrl: "https://binhthuan.gov.vn/"
  },
  {
    id: "tphcm",
    name: "TP. Hồ Chí Minh",
    region: "TP. Hồ Chí Minh",
    tags: ["ẩm thực", "văn hóa"],
    budget: 2, pace: "nhanh",
    habits: ["cú đêm", "gia đình", "đi một mình"],
    interests: ["mua sắm", "ẩm thực", "lịch sử", "nightlife"],
    meta: "Thành phố năng động nhất Việt Nam",
    text: "TP. Hồ Chí Minh — trung tâm kinh tế của cả nước — bừng sáng liên tục 24/7 với ẩm thực đường phố phong phú, bảo tàng lịch sử sâu sắc và đời sống văn hóa cực kỳ phong phú.",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
    lat: 10.8231, lng: 106.6297, top: false,
    transportTips: "Grab tiện lợi nhất; xe buýt BRT cho đường dài. Tránh giờ cao điểm 7-9h sáng và 17-19h chiều sẽ bị kẹt xe nghiêm trọng.",
    activities: [
      { dayPart: "Sáng", title: "Dinh Độc Lập & Bảo tàng Chứng tích Chiến tranh", tip: "Mua vé online để tránh xếp hàng; trang phục lịch sự khi vào Dinh." },
      { dayPart: "Chiều", title: "Chợ Bến Thành & Phố đi bộ Nguyễn Huệ", tip: "Mặc cả 30-50% ở chợ; cẩn thận móc túi trong đám đông." },
      { dayPart: "Tối", title: "Bánh mì Huỳnh Hoa & Quán bar Rooftop", tip: "Rooftop trên tầng cao nhìn toàn cảnh thành phố về đêm — đặt bàn trước." }
    ],
    accommodations: [
      {
        name: "The Reverie Saigon",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.9,
        description: "Khách sạn 6 sao sang trọng bậc nhất nằm trong tòa nhà Times Square.",
        priceRange: "8,000,000 - 20,000,000 VND",
        address: "22-36 Nguyễn Huệ, Quận 1, TP.HCM"
      }
    ],
    diningPlaces: [
      {
        name: "Bánh mì Huỳnh Hoa",
        image: "https://images.unsplash.com/photo-1509722747041-074f18d68246?w=400&q=80",
        rating: 4.7,
        description: "Ổ bánh mì đắt kỷ lục nhưng đầy ắp các loại chả, bơ và pate độc quyền.",
        priceRange: "60,000 - 80,000 VND",
        address: "26 Lê Thị Riêng, Quận 1, TP.HCM"
      }
    ],
    checkInSpots: [
      {
        name: "Landmark 81 Skyview",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
        rating: 4.8,
        description: "Đài quan sát cao nhất Đông Nam Á, nơi ngắm toàn cảnh Sài Gòn rực rỡ.",
        address: "720A Điện Biên Phủ, Quận Bình Thạnh"
      }
    ],
    sourceName: "Sở Du lịch TP. Hồ Chí Minh",
    sourceUrl: "https://tourism.hochiminhcity.gov.vn/"
  },
  {
    id: "buon-ma-thuot",
    name: "Buôn Ma Thuột",
    region: "Đắk Lắk",
    tags: ["văn hóa", "ẩm thực"],
    budget: 1, pace: "cham",
    habits: ["đi một mình", "gia đình"],
    interests: ["cà phê", "voi", "thác", "bản làng"],
    meta: "Thủ đô Cà phê Việt Nam & Văn hóa Tây Nguyên",
    text: "Buôn Ma Thuột là thủ phủ cà phê nổi tiếng thế giới, nơi những vùng đất đỏ bazan rực rỡ nuôi dưỡng cà phê Robusta hảo hạng cùng văn hóa cồng chiêng Tây Nguyên được UNESCO bảo tồn.",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
    lat: 12.6797, lng: 108.0506, top: false,
    transportTips: "Bay thẳng đến sân bay Buôn Ma Thuột hoặc xe khách từ TP.HCM (~8h). Thuê xe máy để tham quan vùng ngoại ô và các buôn làng.",
    activities: [
      { dayPart: "Sáng", title: "Tham quan Vườn cà phê & Trải nghiệm hái", tip: "Mùa thu hoạch tháng 11-1. Đặt tour Farm-to-Cup trải nghiệm toàn quy trình." },
      { dayPart: "Chiều", title: "Thác Gia Long & Chứa Chan hùng vĩ", tip: "Mùa mưa cuối năm nước to ấn tượng hơn; kiểm tra đường vào mùa mưa." },
      { dayPart: "Tối", title: "Cơm lam & Rượu cần tại buôn làng Ê Đê", tip: "Tham gia lễ hội cồng chiêng nếu may mắn trùng lịch. Vô cùng ấn tượng." }
    ],
    accommodations: [
      {
        name: "Muong Thanh Luxury Buon Ma Thuot Hotel",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
        rating: 4.6,
        description: "Khách sạn cao cấp hàng đầu tại trung tâm thành phố cà phê.",
        priceRange: "1,200,000 - 2,500,000 VND",
        address: "81 Nguyễn Tất Thành, Buôn Ma Thuột"
      }
    ],
    diningPlaces: [
      {
        name: "Bún đỏ Buôn Ma Thuột",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        rating: 4.5,
        description: "Món ăn đường phố đặc trưng với sợi bún nhuộm màu hạt điều đẹp mắt.",
        priceRange: "30,000 - 50,000 VND",
        address: "Phan Đình Giót, Buôn Ma Thuột"
      }
    ],
    checkInSpots: [
      {
        name: "Bảo tàng Thế giới Cà phê",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80",
        rating: 4.9,
        description: "Công trình kiến trúc lấy cảm hứng từ nhà rông Tây Nguyên, điểm check-in cực phẩm.",
        address: "Nguyễn Đình Chiểu, Buôn Ma Thuột"
      }
    ],
    sourceName: "Cổng TTĐT Tỉnh Đắk Lắk",
    sourceUrl: "https://daklak.gov.vn/"
  },
  {
    id: "tam-dao",
    name: "Tam Đảo",
    region: "Vĩnh Phúc",
    tags: ["leo núi", "nghỉ dưỡng"],
    budget: 1, pace: "cham",
    habits: ["gia đình", "cặp đôi"],
    interests: ["núi", "sương mù", "nghỉ dưỡng", "thiên nhiên"],
    meta: "Núi sương mù lãng mạn gần Hà Nội",
    text: "Tam Đảo như một ốc đảo xanh mát cách Hà Nội chỉ 80km, thị trấn núi bồng bềnh trong mây mù huyền ảo với kiến trúc cổ điển Pháp, rừng nguyên sinh và khí hậu mát mẻ dễ chịu.",
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80",
    lat: 21.4684, lng: 105.6436, top: false,
    transportTips: "Ô tô từ Hà Nội khoảng 1.5-2 tiếng. Đường núi dốc và có thể trơn trượt khi mưa — vào mùa mưa cần xe có gầm cao.",
    activities: [
      { dayPart: "Sáng", title: "Leo đỉnh Phù Nghĩa ngắm mây cuộn", tip: "Xuất phát lúc 5h30 để bắt được sương mù đẹp; sương tan lúc 9-10h." },
      { dayPart: "Chiều", title: "Tây Thiên & Rừng nguyên sinh cáp treo", tip: "Trang phục lịch sự khi vào khu chùa tâm linh; cáp treo 2500m dài nhất VN." },
      { dayPart: "Tối", title: "Lợn cắp nách & Su su xào tỏi đặc sản", tip: "Thị trấn nhỏ, chọn nhà hàng có đánh giá tốt trên Google Maps." }
    ],
    accommodations: [
      {
        name: "Poko Eco Lodge Tam Dao",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80",
        rating: 4.5,
        description: "Khu nghỉ dưỡng xanh giữa lưng chừng núi, lý tưởng để săn mây.",
        priceRange: "1,000,000 - 2,500,000 VND",
        address: "Khu 2, Thị trấn Tam Đảo"
      }
    ],
    diningPlaces: [
      {
        name: "Su su Tam Đảo xào tỏi",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
        rating: 4.7,
        description: "Đặc sản rau xanh nổi tiếng nhờ khí hậu mát mẻ quanh năm.",
        priceRange: "50,000 - 150,000 VND",
        address: "Các nhà hàng tại thị trấn Tam Đảo"
      }
    ],
    checkInSpots: [
      {
        name: "Cổng trời Tam Đảo",
        image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400&q=80",
        rating: 4.6,
        description: "Nơi sương mù bao phủ, tạo nên khung cảnh huyền ảo như cõi tiên.",
        address: "Dốc Tam Đảo, Vĩnh Phúc"
      }
    ],
    sourceName: "Cổng TTĐT Tỉnh Vĩnh Phúc",
    sourceUrl: "https://vinhphuc.gov.vn/"
  },
  {
    id: "mui-ne-fantasy",
    name: "Làng Chài Cổ Thạch",
    region: "Bình Thuận",
    tags: ["biển", "văn hóa"],
    budget: 1, pace: "cham",
    habits: ["đi một mình", "cặp đôi"],
    interests: ["biển đá", "nhiếp ảnh", "yên tĩnh", "bình minh"],
    meta: "Bãi đá san hô huyền bí & Bình minh đẹp nhất",
    text: "Cổ Thạch còn là một bí mật ít được biết đến với bãi đá cuội và san hô kỳ lạ lộ ra khi nước ròng, làng chài mộc mạc và bình minh rực rỡ được nhiếp ảnh gia săn tìm.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80",
    lat: 11.1543, lng: 108.3522, top: false,
    transportTips: "Xe máy từ Phan Thiết khoảng 50km (1 tiếng). Nhất định tra lịch thủy triều trước khi đến để chụp được bãi đá lộ.",
    activities: [
      { dayPart: "Sáng", title: "Chụp ảnh bãi đá lúc bình minh & Nước ròng", tip: "Dậy 4h30 để có mặt tại bãi lúc 5h; đi dép xỉn hoặc giày cao su chống trơn." },
      { dayPart: "Chiều", title: "Ghé làng chài Cổ Thạch mua hải sản tươi", tip: "Mang mát để uống vì khu này ít quán ăn. Hải sản giá địa phương cực rẻ." },
      { dayPart: "Tối", title: "Sưu tập ảnh hoàng hôn đẹp hồng", tip: "Trời quang thì cực đẹp; mang máy ảnh có ống kính tốt để ghi lại khoảnh khắc." }
    ],
    accommodations: [
      {
        name: "Nhà nghỉ/Homestay Cổ Thạch",
        image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&q=80",
        rating: 4.2,
        description: "Các chỗ nghỉ dân dã, gần gũi với đời sống làng chài.",
        priceRange: "300,000 - 600,000 VND",
        address: "Làng chài Cổ Thạch, Bình Thuận"
      }
    ],
    diningPlaces: [
      {
        name: "Hải sản vỉa hè Cổ Thạch",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
        rating: 4.5,
        description: "Hải sản tươi rói vừa cập bến, chế biến đơn giản nhưng cực kỳ đậm đà.",
        priceRange: "100,000 - 300,000 VND",
        address: "Khu vực bãi biển Cổ Thạch"
      }
    ],
    checkInSpots: [
      {
        name: "Bãi đá bảy màu",
        image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=400&q=80",
        rating: 4.8,
        description: "Bãi đá kỳ lạ với hàng ngàn viên đá đủ hình dáng và màu sắc sặc sỡ.",
        address: "Bình Thạnh, Tuy Phong, Bình Thuận"
      }
    ],
    sourceName: "Cổng TTĐT Tỉnh Bình Thuận",
    sourceUrl: "https://binhthuan.gov.vn/"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');

    await Place.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu cũ');

    const seedData = placesData.map(p => ({ ...p, status: 'approved' }));
    const result = await Place.insertMany(seedData);
    console.log(`✅ Đã nạp thành công ${result.length} điểm du lịch vào MongoDB!`);
    
    result.forEach(p => {
      console.log(`   📍 ${p.name} (${p.region}) — ${p.sourceUrl ? '✔ có nguồn' : '✗ chưa có nguồn'}`);
    });

    await mongoose.disconnect();
    console.log('\n🎉 Hoàn tất! Database đã được cập nhật với dữ liệu mới đầy đủ nguồn gốc.');
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
  }
}

seed();
