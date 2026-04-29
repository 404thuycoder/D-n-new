const mongoose = require('mongoose');

const NotificationTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // info, success, warning, broadcast
  category: { type: String, default: 'general' }, // system, promotion, account, maintenance
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NotificationTemplate', NotificationTemplateSchema);
