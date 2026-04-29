const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const BusinessAccount = require('../models/BusinessAccount');
const AdminAccount = require('../models/AdminAccount');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wanderviet';

async function updateIds() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const generateId = (prefix) => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `${prefix}${randomNum}`;
  };

  // Update Users
  const users = await User.find();
  console.log(`Checking ${users.length} users...`);
  for (const user of users) {
    let prefix = 'user';
    if (user.role === 'business') prefix = 'business';
    else if (user.role === 'admin' || user.role === 'superadmin') prefix = 'admin';
    
    // Force update if not matching pattern
    const pattern = new RegExp(`^${prefix}\\d{8}$`);
    if (!user.customId || !pattern.test(user.customId)) {
      user.customId = generateId(prefix);
      await user.save();
      console.log(`Updated user ${user.email}: ${user.customId}`);
    }
  }

  // Update BusinessAccounts
  const businesses = await BusinessAccount.find();
  console.log(`Checking ${businesses.length} businesses...`);
  for (const biz of businesses) {
    const pattern = /^business\d{8}$/;
    if (!biz.customId || !pattern.test(biz.customId)) {
      biz.customId = generateId('business');
      await biz.save();
      console.log(`Updated business ${biz.email}: ${biz.customId}`);
    }
  }

  // Update AdminAccounts
  const admins = await AdminAccount.find();
  console.log(`Checking ${admins.length} admins...`);
  for (const admin of admins) {
    const pattern = /^admin\d{8}$/;
    if (!admin.customId || !pattern.test(admin.customId)) {
      admin.customId = generateId('admin');
      await admin.save();
      console.log(`Updated admin ${admin.email}: ${admin.customId}`);
    }
  }

  console.log('Update complete!');
  process.exit(0);
}

updateIds().catch(err => {
  console.error(err);
  process.exit(1);
});
