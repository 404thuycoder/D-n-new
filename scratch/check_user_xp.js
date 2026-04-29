const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkUser() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderviet');
  const user = await User.findOne({ email: /thuy/i }); // Search for user Thuy
  if (user) {
    console.log('USER_FOUND:', {
      email: user.email,
      points: user.points,
      rank: user.rank,
      rankTier: user.rankTier,
      claimedQuests: user.claimedQuests
    });
  } else {
    console.log('USER_NOT_FOUND');
  }
  await mongoose.disconnect();
}

checkUser();
