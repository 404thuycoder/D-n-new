const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId:   { type: String, unique: true }, // TXN-XXXXXX
  userId:          { type: String, required: true, index: true },
  type:            { type: String, enum: ['tour_booking', 'upgrade', 'refund', 'topup'], required: true },
  amount:          { type: Number, required: true },
  currency:        { type: String, default: 'VND' },
  status:          { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  // References
  bookingId:       { type: String, default: null },       // ref to Booking.bookingId
  paymentMethodId: { type: String, default: null },       // ref to PaymentMethod._id
  upgradePlan:     { type: String, enum: ['premium', 'elite', null], default: null },
  // Display info
  description:     { type: String, default: '' },
  placeName:       { type: String, default: '' },
  receiptUrl:      { type: String, default: '' },
  // Payment gateway
  gatewayRef:      { type: String, default: '' },         // Mã tham chiếu cổng TT
  gatewayResponse: { type: String, default: '' },
  createdAt:       { type: Date, default: Date.now }
});

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ bookingId: 1 });
module.exports = mongoose.model('Transaction', transactionSchema);
