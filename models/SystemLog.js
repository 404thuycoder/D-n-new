const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'PLACE_CREATED', 'USER_LOGIN', 'BUSINESS_UPDATE'
  details: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String },
  userRole: { type: String },
  targetId: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Thêm Indexes để chống nghẽn cổ chai (High Latency) khi truy vấn sort & filter
systemLogSchema.index({ timestamp: -1 });
systemLogSchema.index({ userName: 1, timestamp: -1 });
systemLogSchema.index({ action: 1 });

module.exports = mongoose.model('SystemLog', systemLogSchema);
