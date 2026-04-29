/**
 * FIX CUSTOM IDS FOR ALL ACCOUNTS
 * Đồng bộ định dạng ID: userXXXXXXXX, businessXXXXXXXX, adminXXXXXXXX
 */
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const AdminAccount = require('../models/AdminAccount');
const BusinessAccount = require('../models/BusinessAccount');

function generateCustomId(role) {
  let prefix = 'user';
  if (role === 'business') prefix = 'business';
  else if (role === 'admin' || role === 'superadmin') prefix = 'admin';
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${randomNum}`;
}

async function fix() {
  console.log('🔄 Đang kết nối MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI.trim());
  console.log('✅ Đã kết nối.\n');

  // 1. Fix Users
  console.log('👥 Đang xử lý tài khoản User...');
  const users = await User.find();
  for (const u of users) {
    if (!u.customId || !u.customId.startsWith('user')) {
      const oldId = u.customId;
      u.customId = generateCustomId('user');
      await u.save();
      console.log(`   - [User] ${u.email}: ${oldId || 'None'} -> ${u.customId}`);
    }
  }

  // 2. Fix Businesses
  console.log('\n🏢 Đang xử lý tài khoản Business...');
  const businesses = await BusinessAccount.find();
  for (const b of businesses) {
    if (!b.customId || !b.customId.startsWith('business')) {
      const oldId = b.customId;
      b.customId = generateCustomId('business');
      await b.save();
      console.log(`   - [Business] ${b.email}: ${oldId || 'None'} -> ${b.customId}`);
    }
  }

  // 3. Fix Admins
  console.log('\n🛡️ Đang xử lý tài khoản Admin...');
  const admins = await AdminAccount.find();
  for (const a of admins) {
    if (!a.customId || !a.customId.startsWith('admin')) {
      const oldId = a.customId;
      a.customId = generateCustomId('admin');
      await a.save();
      console.log(`   - [Admin] ${a.email}: ${oldId || 'None'} -> ${a.customId}`);
    }
  }

  console.log('\n✨ Hoàn tất đồng bộ ID cho tất cả tài khoản!');
  await mongoose.disconnect();
}

fix().catch(err => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
