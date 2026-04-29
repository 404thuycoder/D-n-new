const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  targetId: { type: String, required: true, index: true }, // ID của Dịch vụ, Doanh nghiệp hoặc Địa điểm
  targetType: { type: String, enum: ['service', 'business', 'place'], required: true },
  
  type: { 
    type: String, 
    enum: ['like', 'favorite', 'not_interested', 'view'], 
    required: true 
  },
  
  createdAt: { type: Date, default: Date.now }
});

// Đảm bảo mỗi user chỉ Like/Favorite một thứ 1 lần
interactionSchema.index({ userId: 1, targetId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Interaction', interactionSchema);
