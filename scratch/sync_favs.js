require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('../models/Place');
const User = require('../models/User');

async function syncFavorites() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wanderviet');
    console.log('Connected to MongoDB');

    const users = await User.find({}).lean();
    const actualCounts = {};

    users.forEach(user => {
      if (user.favorites && Array.isArray(user.favorites)) {
        user.favorites.forEach(placeId => {
          actualCounts[placeId] = (actualCounts[placeId] || 0) + 1;
        });
      }
    });

    const places = await Place.find({});
    console.log(`Processing ${places.length} places...`);

    let updatedCount = 0;
    for (const place of places) {
      const realCount = actualCounts[place.id] || 0;
      
      // Recalculate reviews stats
      const reviews = place.reviews || [];
      const reviewCount = reviews.length;
      let ratingAvg = '0';
      if (reviewCount > 0) {
        const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
        ratingAvg = (sum / reviewCount).toFixed(1);
      }

      let needsUpdate = false;
      if (place.favoritesCount !== realCount) {
        place.favoritesCount = realCount;
        needsUpdate = true;
      }
      if (place.reviewCount !== reviewCount) {
        place.reviewCount = reviewCount;
        needsUpdate = true;
      }
      if (place.ratingAvg !== ratingAvg) {
        place.ratingAvg = ratingAvg;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await place.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} places with real interaction data.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error syncing favorites:', err);
    process.exit(1);
  }
}

syncFavorites();
