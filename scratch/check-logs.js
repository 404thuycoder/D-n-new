const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const SystemLog = require('../models/SystemLog');

async function checkLogs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wander_viet');
    console.log('Connected to MongoDB');
    
    const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(5);
    console.log('Latest 5 logs:');
    logs.forEach(l => {
      console.log(`[${l.timestamp}] ${l.userName} (${l.userRole}): ${l.action}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkLogs();
