require('dotenv').config();
const mongoose = require('mongoose');
const chatbotDb = mongoose.createConnection(process.env.CHATBOT_MONGODB_URI);

const KnowledgeSchema = new mongoose.Schema({
  question: String,
  answer: String
});
const Knowledge = chatbotDb.model('Knowledge', KnowledgeSchema);

chatbotDb.on('open', async () => {
    console.log('Connected to Chatbot DB for repair...');
    
    // Tìm các câu trả lời bắt đầu bằng "WanderViệt thấy" hoặc có chứa cụm từ này
    const patterns = [
        /^WanderViệt thấy rằng /i,
        /^WanderViệt thấy /i,
        /^Chào bạn, WanderViệt thấy /i
    ];
    
    let count = 0;
    const documents = await Knowledge.find({});
    
    for (let doc of documents) {
        let original = doc.answer;
        let modified = original;
        
        for (let pattern of patterns) {
            if (pattern.test(modified)) {
                modified = modified.replace(pattern, "");
                // Viết hoa chữ cái đầu tiên sau khi xóa tiền tố
                modified = modified.charAt(0).toUpperCase() + modified.slice(1);
            }
        }
        
        if (modified !== original) {
            doc.answer = modified;
            await doc.save();
            count++;
            console.log(`[Fixed] "${doc.question.substring(0, 30)}..."`);
        }
    }
    
    console.log(`✅ Đã sửa thành công ${count} bản ghi bị "ngáo" tiền tố.`);
    process.exit(0);
});
