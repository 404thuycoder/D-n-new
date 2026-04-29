const mongoose = require('mongoose');

const SystemConfigSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: 'Hệ thống đang được bảo trì để nâng cấp trải nghiệm tốt hơn. Vui lòng quay lại sau.' },
  registrationEnabled: { type: Boolean, default: true },
  aiModel: { type: String, default: 'llama-3.1-8b' },
  aiTemperature: { type: Number, default: 0.7 },
  contextAwareChat: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemConfig', SystemConfigSchema);
