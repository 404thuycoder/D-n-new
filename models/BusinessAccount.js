const mongoose = require('mongoose');

const businessAccountSchema = new mongoose.Schema({
  customId: { type: String, unique: true, sparse: true, index: true },
  name: { type: String, required: true },
  displayName: { type: String, default: '' },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  points: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model('BusinessAccount', businessAccountSchema);
