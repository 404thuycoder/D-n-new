const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  userId:      { type: String, required: true, index: true },
  type:        { type: String, enum: ['card', 'momo', 'zalopay', 'vnpay', 'bank_transfer'], required: true },
  label:       { type: String, default: '' },      // "Thẻ Visa **** 4242"
  // Card specific
  cardLast4:   { type: String, default: '' },
  cardBrand:   { type: String, default: '' },      // visa / mastercard / jcb
  cardExpiry:  { type: String, default: '' },      // "12/27"
  cardHolder:  { type: String, default: '' },
  // E-wallet specific
  walletPhone: { type: String, default: '' },      // Số điện thoại ví
  // Bank transfer
  bankName:    { type: String, default: '' },
  bankAccount: { type: String, default: '' },
  bankOwner:   { type: String, default: '' },

  isDefault:   { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

paymentMethodSchema.index({ userId: 1, isDefault: 1 });
module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
