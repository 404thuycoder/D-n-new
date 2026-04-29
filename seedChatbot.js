require('dotenv').config();
const mongoose = require('mongoose');
const Knowledge = require('./models/Knowledge');
const chatbotDb = require('./models/dbChatbot');

const faqs = [
  // HỆ THỐNG & TÀI KHOẢN
  { question: "Làm sao để đăng ký tài khoản?", answer: "Bạn nhấn vào nút 'Đăng nhập' ở góc phải màn hình, sau đó chọn 'Chưa có tài khoản? Đăng ký ngay' và điền thông tin là xong!" },
  { question: "Tôi quên mật khẩu thì phải làm sao?", answer: "Hiện tại WanderViệt hỗ trợ đăng nhập qua Google. Nếu bạn dùng tài khoản riêng, hãy liên hệ admin để được reset mật khẩu nhé." },
  { question: "Làm thế nào để đổi mật khẩu?", answer: "Bạn vào trang 'Cá nhân' -> 'Cài đặt' -> 'Đổi mật khẩu' và nhập mật khẩu mới nhé." },
  { question: "Làm sao để xóa tài khoản?", answer: "Bạn có thể gửi yêu cầu xóa tài khoản tại mục 'Hỗ trợ' hoặc 'Liên hệ' ở cuối trang." },
  { question: "WanderViệt là gì?", answer: "WanderViệt là nền tảng du lịch thông minh sử dụng AI để giúp bạn lên lịch trình (Planner) và hướng dẫn đường đi GPS (Navigator) chuyên nghiệp." },

  // LÊN KẾ HOẠCH (PLANNER)
  { question: "Cách sử dụng AI Trợ lý để lên lịch?", answer: "Bạn vào mục 'AI Trợ lý', chọn điểm đến, sở thích, ngân sách và nhấn 'Tạo lịch trình'. AI sẽ tự động phân bổ các điểm tham quan theo ngày cho bạn." },
  { question: "Tôi có thể sửa lịch trình sau khi tạo không?", answer: "Có! Bạn có thể kéo thả, xóa hoặc thêm mới các điểm tham quan trong trang chỉnh sửa lịch trình của mình." },
  { question: "Lưu lịch trình ở đâu?", answer: "Sau khi tạo xong, bạn nhấn 'Lưu chuyến đi'. Lịch trình sẽ xuất hiện trong mục 'Chuyến đi của tôi' (My Trips)." },
  { question: "Làm sao để chia sẻ lịch trình cho bạn bè?", answer: "Trong mỗi chuyến đi, có nút 'Chia sẻ'. Bạn có thể copy link hoặc gửi trực tiếp qua mạng xã hội cho bạn bè cùng xem." },

  // DẪN ĐƯỜNG (NAVIGATOR)
  { question: "Làm sao để bắt đầu dẫn đường?", answer: "Bạn chọn một điểm đến hoặc mở một lịch trình có sẵn, sau đó nhấn nút 'Bắt đầu'. Hệ thống sẽ dùng GPS để chỉ hướng cho bạn." },
  { question: "Tại sao Navigator không tìm thấy vị trí của tôi?", answer: "Bạn cần cấp quyền truy cập GPS cho trình duyệt. Ngoài ra hãy đảm bảo bạn đang đứng ở khu vực thoáng đãng để sóng GPS ổn định hơn." },
  { question: "Dẫn đường có hỗ trợ giọng nói không?", answer: "Có! WanderViệt có trợ lý ảo phát âm tiếng Việt để nhắc bạn rẽ trái, rẽ phải hoặc khi sắp đến đích." },
  { question: "Chế độ 'Đi bộ' và 'Xe máy' khác gì?", answer: "Hệ thống sẽ tính toán đường đi tối ưu theo loại phương tiện. Đi bộ sẽ ưu tiên các đường nhỏ, ngõ tắt hoặc phố đi bộ." },

  // ĐỊA ĐIỂM DU LỊCH (FAQ ĐIỂM ĐẾN)
  { question: "Thời điểm nào đẹp nhất để đi Sapa?", answer: "Sapa đẹp nhất vào tháng 3-5 (mùa hoa) hoặc tháng 9-11 (mùa lúa chín). Nếu muốn săn tuyết, bạn có thể đi vào tháng 12 đến tháng 2." },
  { question: "Đà Nẵng có gì chơi buổi tối?", answer: "Bạn có thể xem Cầu Rồng phun lửa (cuối tuần), đi dạo Chợ đêm Sơn Trà, hoặc lên du thuyền sông Hàn ngắm cảnh thành phố." },
  { question: "Các món ăn phải thử khi đến Huế?", answer: "Đừng bỏ qua Bún bò Huế, Cơm hến, Bánh bèo - nậm - lọc và các loại chè cung đình Huế nhé!" },
  { question: "Làm sao để đi từ Hà Nội đến Ninh Bình?", answer: "Bạn có thể đi xe khách, tàu hỏa hoặc xe limousine từ các bến xe Mỹ Đình, Giáp Bát. Thời gian di chuyển khoảng 1.5 - 2 giờ." },
  { question: "Phố cổ Hội An có thu phí vào cổng không?", answer: "Hội An có bán vé tham quan để bảo tồn di tích. Bạn nên mua vé để được vào thăm các nhà cổ và xem biểu diễn nghệ thuật." },

  // MẸO DU LỊCH & AN TOÀN
  { question: "Cần chuẩn bị gì khi đi du lịch tự túc?", answer: "Bạn nên chuẩn bị: Giấy tờ tùy thân, bản đồ offline (WanderViệt Navigator), một ít tiền mặt, thuốc men cơ bản và sạc dự phòng." },
  { question: "Làm sao để tiết kiệm chi phí khi đi du lịch?", answer: "Hãy đặt vé/phòng sớm, ăn uống tại các quán địa phương thay vì nhà hàng sang trọng, và sử dụng WanderViệt Planner để tối ưu lộ trình di chuyển." },
  { question: "Lưu ý gì khi đi du lịch vào mùa mưa?", answer: "Luôn mang theo áo mưa/ô, bọc chống nước cho điện thoại, và thường xuyên cập nhật dự báo thời tiết trên app." },
  { question: "Làm gì khi bị lạc đường?", answer: "Hãy dùng nút 'Định tâm' trên WanderViệt Navigator hoặc hỏi cư dân địa phương. Người Việt Nam rất thân thiện và sẵn lòng chỉ giúp bạn!" },

  // CÂU HỎI VỀ WANDERVIỆT
  { question: "Sử dụng WanderViệt có mất phí không?", answer: "WanderViệt hoàn toàn miễn phí cho người dùng cá nhân. Chúng tôi mong muốn mang lại trải nghiệm du lịch tốt nhất cho bạn." },
  { question: "Ai là người tạo ra WanderViệt?", answer: "WanderViệt được phát triển bởi đội ngũ kỹ thuật đam mê du lịch với mong muốn số hóa ngành du lịch Việt Nam." },
  { question: "Tôi có thể đóng góp thông tin địa điểm mới không?", answer: "Có! Bạn có thể vào mục 'Đóng góp' hoặc gửi Feedback cho chúng tôi về các địa điểm mới mà bạn thấy thú vị." },
  // LỖI APP & XỬ LÝ NHANH (Viết không dấu, viết tắt)
  { question: "app bi lag ko load dc map thi lam sao", answer: "Bạn thử kiểm tra lại kết nối mạng (Wifi/4G) hoặc đóng ứng dụng mở lại nhé. Đôi khi do mạng yếu nên bản đồ tải chậm một chút." },
  { question: "map chi duong sai, di vao duong cut", answer: "WanderViệt luôn cố gắng cập nhật dữ liệu liên tục. Nếu gặp đường cấm hoặc đường cụt, bạn nhấn 'Báo cáo lỗi map' để hệ thống tính toán lại đường khác và team dev fix lỗi nha. Xin lỗi bạn vì sự bất tiện này!" },
  { question: "ko co mang xai dc k", answer: "Để lên lịch trình và tìm đường lần đầu bạn cần có mạng. Nhưng sau khi lưu, bạn có thể tải bản đồ offline để dùng khi đi đến các khu vực mất sóng." },
  { question: "app bi vang ra lien tuc xai k dc", answer: "Bạn thử cập nhật ứng dụng lên phiên bản mới nhất hoặc xóa bộ nhớ đệm (cache) của trình duyệt/app xem sao nhé. Nếu vẫn lỗi, hãy inbox cho page để được hỗ trợ kỹ thuật." },

  // TÀI KHOẢN & ĐẶT CHỖ (Viết tắt)
  { question: "qmk r lam the nao de lay lai", answer: "Ở màn hình đăng nhập, bạn chọn 'Quên mật khẩu'. Hệ thống sẽ gửi link đặt lại pass vào email của bạn ngay lập tức." },
  { question: "lam sao de book ksan tren nay", answer: "Hiện tại WanderViệt tập trung vào lên lịch trình và dẫn đường. Nhưng bạn có thể nhấn vào các link liên kết trong phần chi tiết địa điểm để chuyển sang các trang đối tác uy tín đặt phòng nhé." },
  { question: "xoa tk ntn", answer: "Để xóa tài khoản, bạn vào phần 'Cá nhân' -> 'Cài đặt' -> kéo xuống dưới cùng chọn 'Xóa tài khoản'. Lưu ý thao tác này không thể hoàn tác đâu nhé!" },
  { question: "app co tinh phi k vay", answer: "WanderViệt hoàn toàn miễn phí cho các tính năng cơ bản nha bạn! Bạn cứ thoải mái sử dụng để lên kế hoạch vi vu nhé." },

  // LÊN KẾ HOẠCH & TÌM KIẾM NHANH (Viết tắt, ngôn ngữ chat)
  { question: "thay doi thgian lich trinh ntn", answer: "Trong mục 'Chuyến đi của tôi', bạn mở lịch trình ra, nhấn vào biểu tượng cây bút để chỉnh sửa giờ giấc hoặc kéo thả để đổi thứ tự các địa điểm nha." },
  { question: "hnoi co cho nao chill chill ko", answer: "Ở Hà Nội, bạn có thể ghé các quán cafe ở Hồ Tây, dạo phố cổ buổi tối hoặc qua cầu Long Biên hóng gió. Bạn thử dùng AI Planner của app gõ chữ 'chill' để nhận lịch trình chi tiết nhé!" },
  { question: "sg di da lat bang xe may di dg nao", answer: "Từ SG lên Đà Lạt bằng xe máy thường đi theo QL20. Trên Navigator, bạn nhớ chọn phương tiện là 'Xe máy', app sẽ gợi ý lộ trình an toàn và né đường cao tốc ô tô cho bạn." },
  { question: "co tim dc quan an dem k", answer: "Được chứ! Bạn vào ô tìm kiếm gõ 'ăn đêm' hoặc mở AI Planner chọn mốc thời gian khuya, app sẽ tự động gợi ý các quán mở 24/7 hoặc quán nhậu đêm." },
  { question: "add them ban be vao chuyen di kieu gi", answer: "Bạn nhấn nút 'Chia sẻ' trong lịch trình, chọn 'Mời bạn bè cùng chỉnh sửa' và gửi link. Cả nhóm có thể cùng nhau thêm bớt địa điểm đó!" },
  { question: "thue xe may o dau uy tin v shop", answer: "Khi tìm kiếm một thành phố (ví dụ Đà Nẵng, Phú Quốc), bạn kéo xuống mục 'Dịch vụ tiện ích', app có tổng hợp danh sách các cơ sở cho thuê xe máy được đánh giá cao trên mạng." },
  
  // HỎI ĐÁP NGẪU NHIÊN & TÌNH HUỐNG (Không dấu)
  { question: "mua banh dac san o dau ngon", answer: "Trong phần thông tin thành phố, bạn chọn tab 'Đặc sản làm quà'. WanderViệt có list các cửa hàng uy tín có kèm review thực tế để bạn tránh bị chặt chém." },
  { question: "thoi tiet bjo di hue co nong lam k", answer: "Mùa hè ở Huế (tháng 5 - tháng 8) khá nóng bức. Nếu bạn đi mùa này, app sẽ tự động ưu tiên gợi ý các điểm tham quan trong nhà hoặc đi dạo vào buổi chiều tối để mát mẻ hơn." },
  { question: "di phuot 1 minh co tich nang gi ho tro k", answer: "Với dân đi phượt, tính năng Navigator cực kỳ hữu ích với cảnh báo tốc độ, trạm xăng gần nhất và chia sẻ vị trí trực tiếp (Live Location) cho người thân." },
  // LỊCH SỬ & VĂN HÓA (CÓ DẤU)
  { question: "Sự tích Hồ Hoàn Kiếm là gì?", answer: "Hồ Hoàn Kiếm gắn liền với truyền thuyết vua Lê Lợi trả gươm báu cho Rùa Thần sau khi chiến thắng giặc Minh. Đây là biểu tượng lịch sử ngàn năm văn hiến của Thủ đô." },
  { question: "Tại sao lại gọi là Dinh Độc Lập?", answer: "Dinh Độc Lập (nay là Hội trường Thống Nhất) là nơi đánh dấu sự kiện giải phóng miền Nam 30/4/1975. Công trình do KTS Ngô Viết Thụ thiết kế với nhiều ý nghĩa triết học sâu sắc." },
  { question: "Cố đô Huế có bao nhiêu cửa chính?", answer: "Kinh thành Huế có 10 cửa chính để ra vào. Trong đó, Ngọ Môn là cổng lớn nhất và là nơi diễn ra các lễ nghi quan trọng của triều đình nhà Nguyễn." },
  { question: "Phố cổ Hội An có gì đặc biệt về kiến trúc?", answer: "Hội An là sự giao thoa độc đáo giữa kiến trúc Việt Nam, Nhật Bản và Trung Hoa. Những ngôi nhà tường vàng, mái ngói âm dương đã tồn tại hàng trăm năm qua." },
  { question: "Địa đạo Củ Chi dài bao nhiêu km?", answer: "Hệ thống địa đạo Củ Chi có tổng chiều dài hơn 250km, được ví như 'thành phố dưới lòng đất' với đầy đủ phòng ở, bệnh viện và nhà bếp trong thời kỳ kháng chiến." },
  { question: "Kiến trúc Chùa Một Cột có ý nghĩa gì?", answer: "Chùa Một Cột được thiết kế giống như một bông sen mọc lên từ mặt nước. Đây là kiến trúc độc đáo bậc nhất thế giới, thể hiện sự thanh cao của Phật giáo." },

  // ĐỊA ĐIỂM ĐẸP & CHECK-IN (CÓ DẤU)
  { question: "Thời điểm nào ngắm bình minh đẹp nhất ở Phú Quốc?", answer: "Ở Phú Quốc, bạn nên ngắm bình minh tại Làng chài Hàm Ninh. Còn nếu muốn xem hoàng hôn 'cực phẩm' thì Bãi Trường hay Dinh Cậu là lựa chọn số 1." },
  { question: "Địa điểm nào có view toàn cảnh Sapa từ trên cao?", answer: "Để ngắm toàn cảnh Sapa, bạn hãy lên đỉnh núi Hàm Rồng hoặc đi cáp treo lên đỉnh Fansipan. View thung lũng Mường Hoa từ đây đẹp như tranh vẽ." },
  { question: "Cầu Vàng Đà Nẵng nằm ở khu vực nào?", answer: "Cầu Vàng thuộc quần thể du lịch Bà Nà Hills. Đây là cây cầu có thiết kế đôi bàn tay khổng lồ nâng đỡ dải lụa vàng, nổi tiếng toàn cầu." },
  { question: "Hang động nào đẹp nhất ở Vịnh Hạ Long?", answer: "Vịnh Hạ Long có rất nhiều hang động, nhưng nổi tiếng nhất là Hang Sửng Sốt (rộng lớn hùng vĩ) và Hang Đầu Gỗ với những khối thạch nhũ kỳ ảo." },
  { question: "Đèo Mã Pì Lèng có gì mà dân phượt lại mê đến vậy?", answer: "Mã Pì Lèng được mệnh danh là một trong 'tứ đại đỉnh đèo' của Việt Nam. Đứng từ đỉnh đèo nhìn xuống hẻm Tu Sản và dòng sông Nho Quế xanh lục bảo cực kỳ choáng ngợp." },
  { question: "Thung lũng Tình Yêu ở Đà Lạt có gì chơi?", answer: "Đây là khu du lịch lãng mạn với hồ Đa Thiện, các vườn hoa rực rỡ và nhiều tiểu cảnh đẹp cho cặp đôi. Bạn có thể đạp vịt hoặc đi xe jeep tham quan toàn khu." },

  // TRẢI NGHIỆM ĐỊA PHƯƠNG & LỄ HỘI (CÓ DẤU)
  { question: "Lễ hội pháo hoa quốc tế Đà Nẵng thường diễn ra khi nào?", answer: "Lễ hội pháo hoa (DIFF) thường được tổ chức vào mùa hè, khoảng tháng 6 hoặc tháng 7 hàng năm bên bờ sông Hàn thơ mộng." },
  { question: "Đi chợ nổi Cái Răng vào mấy giờ là tốt nhất?", answer: "Bạn nên đi sớm từ 5h - 6h sáng. Đây là lúc chợ sầm uất nhất, bạn có thể ăn sáng ngay trên ghe thuyền và cảm nhận văn hóa miền Tây sông nước." },
  { question: "Mùa lúa chín ở Mù Cang Chải là tháng mấy?", answer: "Mùa vàng Mù Cang Chải đẹp nhất vào nửa cuối tháng 9 đến đầu tháng 10. Những thửa ruộng bậc thang lúc này rực rỡ sắc vàng óng ả." },
  { question: "Thác Bản Giốc thuộc tỉnh nào?", answer: "Thác Bản Giốc nằm ở tỉnh Cao Bằng. Đây là thác nước xuyên biên giới lớn nhất Đông Nam Á, nằm giữa biên giới Việt Nam và Trung Quốc." },
  { question: "Nên đi du lịch tâm linh ở đâu phía Bắc?", answer: "Bạn có thể ghé thăm Chùa Bái Đính (Ninh Bình), Yên Tử (Quảng Ninh) hoặc Chùa Hương (Hà Nội). Đây đều là những thánh địa linh thiêng và có cảnh quan hùng vĩ." },
  // LỄ HỘI & SỰ KIỆN ĐẶC SẮC (Hỏi nhanh)
  { question: "Ở đây có lễ hội gì đặc sắc không?", answer: "Việt Nam có rất nhiều lễ hội theo mùa. Nổi bật nhất là Lễ hội Chùa Hương (Hà Nội), Hội Lim (Bắc Ninh), Lễ hội Pháo hoa (Đà Nẵng) và Lễ hội Nghinh Ông ở các tỉnh ven biển." },
  { question: "Lễ hội Đền Hùng diễn ra khi nào?", answer: "Lễ hội diễn ra vào mùng 10 tháng 3 âm lịch hàng năm tại Phú Thọ. Đây là dịp để con cháu hướng về cội nguồn dân tộc." },
  { question: "Hội An có lễ hội hoa đăng khi nào?", answer: "Lễ hội hoa đăng Hội An diễn ra vào đêm 14 âm lịch hàng tháng. Cả phố cổ sẽ tắt đèn và thắp sáng bằng đèn lồng, tạo nên khung cảnh cực kỳ huyền ảo." },
  { question: "Lễ hội đua ghe ngo là của dân tộc nào?", answer: "Đây là lễ hội truyền thống lớn nhất của người Khmer ở miền Tây (đặc biệt là Sóc Trăng), thường diễn ra vào dịp lễ Ok Om Bok tháng 10 âm lịch." },
  { question: "Festival Hoa Đà Lạt tổ chức mấy năm một lần?", answer: "Festival Hoa Đà Lạt thường được tổ chức 2 năm một lần vào các năm chẵn, thu hút hàng triệu du khách đến thưởng lãm sắc hoa." },
  { question: "Lễ hội Cầu Ngư có ý nghĩa gì?", answer: "Đây là lễ hội của ngư dân vùng biển miền Trung và miền Nam để tạ ơn cá Ông và cầu mong một năm mưa thuận gió hòa, tôm cá đầy khoang." },

  // NÉT ĐẸP VĂN HÓA & TRẢI NGHIỆM NHANH
  { question: "Ở đây có gì đẹp để tham quan?", answer: "Tùy vào điểm đến của bạn! Nếu ở miền Bắc hãy ngắm cảnh núi non hùng vĩ, miền Trung có những bãi biển xanh ngắt và miền Tây là sông nước miệt vườn. Bạn check mục 'Gợi ý' trên app nhé!" },
  { question: "Văn hóa cồng chiêng Tây Nguyên có gì hay?", answer: "Đây là Di sản văn hóa phi vật thể thế giới. Bạn có thể tham gia các buổi giao lưu văn hóa, xem biểu diễn cồng chiêng và uống rượu cần cùng người dân bản địa." },
  { question: "Mùa nào đi xem lúa chín đẹp nhất?", answer: "Mùa lúa chín (mùa vàng) đẹp nhất là ở Mù Cang Chải hoặc Y Tý vào khoảng cuối tháng 9, đầu tháng 10 hàng năm." },
  { question: "Chợ tình Sapa diễn ra vào tối thứ mấy?", answer: "Chợ tình Sapa thường diễn ra vào tối thứ 7 hàng tuần. Đây là nét văn hóa kết bạn, giao duyên độc đáo của đồng bào dân tộc vùng cao." },
  { question: "Múa rối nước xem ở đâu chuẩn nhất?", answer: "Tại Hà Nội, bạn nên xem ở Nhà hát Múa rối Thăng Long (gần Hồ Gươm). Đây là môn nghệ thuật dân gian độc đáo chỉ có tại Việt Nam." },
  { question: "Có lễ hội nào dành cho người thích ẩm thực không?", answer: "Các thành phố lớn như TP.HCM, Đà Nẵng, Huế thường tổ chức 'Lễ hội Văn hóa Ẩm thực' vào các dịp lễ lớn, quy tụ đặc sản từ khắp mọi miền." }

];

async function seedChatbot() {
  try {
    // Chờ kết nối
    await new Promise(resolve => {
        if (chatbotDb.readyState === 1) resolve();
        else chatbotDb.once('open', resolve);
    });
    
    console.log('--- Đang xóa dữ liệu cũ (Learning cũ) để làm mới... ---');
    await Knowledge.deleteMany({}); 

    console.log(`--- Đang nạp ${faqs.length} câu hỏi AI/FAQ vào Database Chatbot... ---`);
    
    let count = 0;
    for (const faq of faqs) {
      // Kiểm tra xem đã tồn tại chưa để tránh trùng lặp
      const exists = await Knowledge.findOne({ question: faq.question });
      if (!exists) {
        await new Knowledge(faq).save();
        count++;
      }
    }

    console.log(`✅ Hoàn thành! Đã nạp thành công ${count}/${faqs.length} câu hỏi mới.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi Seeding Chatbot:', err);
    process.exit(1);
  }
}

seedChatbot();
