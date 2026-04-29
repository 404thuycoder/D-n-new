require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Knowledge = require('./models/Knowledge');
const chatbotDb = require('./models/dbChatbot');

async function seedMaster() {
  try {
    // 1. Chờ kết nối Database
    await new Promise((resolve, reject) => {
      if (chatbotDb.readyState === 1) resolve();
      else {
        chatbotDb.once('open', resolve);
        chatbotDb.on('error', reject);
      }
    });
    console.log('✅ Đã kết nối Database Chatbot.');

    // 2. Danh sách các file dữ liệu cần nạp
    const dataFiles = [
      'data/chatbot/general.json',
      'data/chatbot/destinations.json'
    ];

    let totalImported = 0;

    for (const fileRelPath of dataFiles) {
      const filePath = path.join(__dirname, fileRelPath);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Cảnh báo: Không tìm thấy file ${fileRelPath}`);
        continue;
      }

      console.log(`--- Đang xử lý file: ${fileRelPath} ---`);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      for (const item of data) {
        // Upsert: Nếu trùng câu hỏi thì cập nhật câu trả lời, nếu chưa có thì thêm mới
        await Knowledge.findOneAndUpdate(
          { question: item.question },
          item,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
      
      totalImported += data.length;
      console.log(`✅ Đã nạp xong ${data.length} câu từ ${fileRelPath}`);
    }

    console.log(`\n🎉 HOÀN THÀNH TẤT CẢ! Tổng cộng: ${totalImported} mục tri thức đã sẵn sàng.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi hệ thống Seeding:', err.message);
    process.exit(1);
  }
}

seedMaster();
