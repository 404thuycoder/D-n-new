const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wanderviet');
    const users = await User.find({}).select('name displayName points role');
    console.log('--- All Users List ---');
    users.forEach(u => {
      console.log(`Name: ${u.name}, DisplayName: ${u.displayName}, Role: ${u.role}, Points: ${u.points}`);
    });
    console.log('------------------');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkAllUsers();
