const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId:   { type: String, unique: true }, // e.g. BK-123456
  placeId:     { type: String, required: true },
  placeName:   { type: String },
  userId:      { type: String },
  customerName: { type: String, required: true },
  customerEmail:{ type: String },
  customerPhone:{ type: String },
  useDate:     { type: Date, required: true },
  peopleCount: { type: Number, default: 1 },
  totalPrice:  { type: Number, default: 0 },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  ownerId:     { type: String, required: true, index: true }, // Business ID
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
