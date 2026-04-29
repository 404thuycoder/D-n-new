const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

async function checkMyTrips() {
  try {
    const plannerUri = process.env.PLANNER_MONGODB_URI || process.env.MONGODB_URI;
    const plannerDb = mongoose.createConnection(plannerUri);
    const itinerarySchema = new mongoose.Schema({}, { strict: false });
    const Itinerary = plannerDb.model('Itinerary', itinerarySchema, 'itineraries');

    const all = await Itinerary.find().limit(10);
    console.log('Sample Itineraries:');
    all.forEach(i => {
      console.log(`- ID: ${i._id} (Length: ${i._id.toString().length}), Destination: ${i.destination}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkMyTrips();
