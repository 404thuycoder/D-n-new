const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  role: { type: String, default: 'user' },
  name: {
    type: String,
    default: 'Thành viên WanderViệt'
  },
  email: {
    type: String,
    default: 'Không cung cấp'
  },
  message: {
    type: String,
    required: true
  },
  image: {
    type: String, // Base64 string or URL
    default: null
  },
  replies: [{
    senderId: String,
    senderName: String,
    senderRole: { type: String, enum: ['user', 'admin', 'business'] },
    content: String,
    image: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['open', 'closed', 'resolved'], default: 'open' },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
