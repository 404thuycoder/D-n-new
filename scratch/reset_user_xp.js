const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function resetUser() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderviet');
  const user = await User.findOne({ email: /thuy1@gmail.com/i });
  if (user) {
    user.points = 0;
    user.rank = 'Đồng';
    user.rankTier = 'I';
    user.claimedQuests = [];
    await user.save();
    console.log('USER_RESET_SUCCESS');
  } else {
    console.log('USER_NOT_FOUND');
  }
  await mongoose.disconnect();
}

resetUser();
