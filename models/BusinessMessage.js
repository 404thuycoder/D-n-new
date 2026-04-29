const mongoose = require('mongoose');

const businessMessageSchema = new mongoose.Schema({
  businessId: { type: String, required: true, index: true },
  customerId: { type: String, required: true, index: true },
  customerName: { type: String, default: 'Khách hàng' },
  senderRole: { type: String, enum: ['customer', 'business', 'system'], required: true },
  text: { type: String, required: true },
  serviceId: { type: String, default: null }, // ID of the place/service they are asking about
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BusinessMessage', businessMessageSchema);
