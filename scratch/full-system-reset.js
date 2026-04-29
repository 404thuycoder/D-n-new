const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wander-viet-v2';

const User = require('../models/User');
const AdminAccount = require('../models/AdminAccount');
const BusinessAccount = require('../models/BusinessAccount');
const Place = require('../models/Place');
const Conversation = require('../models/Conversation');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');
const SystemLog = require('../models/SystemLog');

const DEFAULT_ADMIN_EMAIL = 'admin@wanderviet.com';
const DEFAULT_ADMIN_PASSWORD = 'password@2006';

async function resetSystem() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected.');

    console.log('🧹 Clearing all collections (Reset to 0)...');
    
    await User.deleteMany({});
    await AdminAccount.deleteMany({});
    await BusinessAccount.deleteMany({});
    await Place.deleteMany({});
    await Conversation.deleteMany({});
    await Notification.deleteMany({});
    await Feedback.deleteMany({});
    await SystemLog.deleteMany({});
    
    console.log('✨ All collections cleared.');

    console.log('👤 Creating default Admin account...');
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
    
    // Generate customId for admin
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    const adminCustomId = `admin${randomNum}`;

    const admin = new AdminAccount({
      email: DEFAULT_ADMIN_EMAIL,
      password: hashedPassword,
      name: 'Super Admin',
      displayName: 'WanderViệt Admin',
      role: 'superadmin',
      customId: adminCustomId,
      status: 'active'
    });

    await admin.save();
    console.log(`✅ Default Admin created: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`);
    console.log(`🆔 Admin CustomID: ${adminCustomId}`);

    console.log('\n🚀 SYSTEM RESET COMPLETE.');
    console.log('You can now start fresh with accurate data.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error resetting system:', err);
    process.exit(1);
  }
}

resetSystem();
