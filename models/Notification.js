const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true, index: true }, // ID người nhận (User/ID/ROLE/ALL)
  recipientType: { type: String, default: 'user' },
  
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ID người gây ra hành động
  senderName: String,
  
  type: { 
    type: String, 
    enum: ['like', 'comment', 'booking', 'tour_request', 'system', 'message'], 
    required: true 
  },
  
  title: String,
  message: String,
  relatedId: mongoose.Schema.Types.ObjectId, // ID của bài viết/dịch vụ liên quan
  link: String, // Đường dẫn để click vào xem ngay
  
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
