const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId:      { type: String, unique: true }, // e.g. BK-123456
  bookingType:    { type: String, enum: ['service', 'tour'], default: 'service' },
  placeId:        { type: String, required: true },
  placeName:      { type: String },
  userId:         { type: String },
  customerName:   { type: String, required: true },
  customerEmail:  { type: String },
  customerPhone:  { type: String },
  useDate:        { type: Date, required: true },  // Ngày sử dụng dịch vụ
  tourDate:       { type: Date, default: null },   // Ngày khởi hành tour
  peopleCount:    { type: Number, default: 1 },
  totalPrice:     { type: Number, default: 0 },
  specialRequests:{ type: String, default: '' },  // Yêu cầu đặc biệt
  paymentMethod:  { type: String, enum: ['contact', 'transfer', 'momo', 'zalopay', 'card'], default: 'contact' },
  paymentStatus:  { type: String, enum: ['unpaid', 'pending', 'paid', 'refunded'], default: 'unpaid' },
  status:         { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  ownerId:        { type: String, required: true, index: true }, // Business ID
  notes:          { type: String, default: '' },  // Ghi chú từ business
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
