const mongoose = require('mongoose');
require('dotenv').config();

const resetRanks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wander_viet');
    console.log('Connected to MongoDB');

    const User = require('../models/User');

    const result = await User.updateMany({}, {
      $set: {
        points: 0,
        rank: 'Đồng',
        rankTier: 'I',
        claimedQuests: []
      }
    });

    console.log(`Successfully reset ranks for ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error('Reset failed:', err);
    process.exit(1);
  }
};

resetRanks();
