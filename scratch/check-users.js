const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderviet');
    const users = await User.find({ role: 'user' }).select('name displayName points');
    console.log('--- Users List ---');
    users.forEach(u => {
      console.log(`Name: ${u.name}, DisplayName: ${u.displayName}, Points: ${u.points}`);
    });
    console.log('------------------');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
