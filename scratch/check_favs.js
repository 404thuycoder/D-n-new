require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('../models/Place');
const User = require('../models/User');

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wanderviet');
  const places = await Place.find({}).select('id name favoritesCount').lean();
  console.log('--- PLACES FAVORITES COUNT ---');
  places.forEach(p => console.log(`${p.id}: ${p.favoritesCount}`));

  const users = await User.find({}).select('email favorites').lean();
  console.log('\n--- USERS FAVORITES ---');
  users.forEach(u => console.log(`${u.email}: ${u.favorites.length} favorites`));

  // Calculate actual counts
  const actualCounts = {};
  users.forEach(u => {
    (u.favorites || []).forEach(fid => {
      actualCounts[fid] = (actualCounts[fid] || 0) + 1;
    });
  });

  console.log('\n--- ACTUAL COUNTS FROM USERS ---');
  Object.keys(actualCounts).forEach(fid => {
    console.log(`${fid}: ${actualCounts[fid]}`);
  });

  await mongoose.disconnect();
}

debug();
