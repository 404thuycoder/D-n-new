const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['broadcast', 'info', 'success', 'warning'], default: 'broadcast' },
  recipientType: { type: String, enum: ['ALL', 'USER', 'BUSINESS', 'ADMIN', 'SPECIFIC'], default: 'ALL' },
  targetId: { type: String, required: true }, // e.g., 'ALL', 'ROLE_BUSINESS', or userId
  senderId: { type: String, required: true },
  senderName: { type: String },
  isScheduled: { type: Boolean, default: false },
  scheduledTime: { type: Date },
  status: { type: String, enum: ['pending', 'sent', 'cancelled'], default: 'sent' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Broadcast', broadcastSchema);
