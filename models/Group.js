const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  avatar: { type: String, default: '' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

groupSchema.index({ 'members.userId': 1 });

module.exports = mongoose.model('Group', groupSchema);
