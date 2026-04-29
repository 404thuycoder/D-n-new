require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const BusinessAccount = require('../models/BusinessAccount');
const AdminAccount = require('../models/AdminAccount');

const generateCustomId = (role) => {
  let prefix = 'user';
  if (role === 'business') prefix = 'business';
  else if (role === 'admin' || role === 'superadmin') prefix = 'admin';
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${randomNum}`;
};

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    const models = [
      { M: User, role: 'user' },
      { M: BusinessAccount, role: 'business' },
      { M: AdminAccount, role: 'admin' }
    ];

    for (const { M, role } of models) {
      const accounts = await M.find({ customId: { $exists: false } });
      console.log(`Migrating ${accounts.length} ${role} accounts...`);
      for (const acc of accounts) {
        acc.customId = generateCustomId(role);
        await acc.save();
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
