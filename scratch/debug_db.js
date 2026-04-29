const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

async function debug() {
  try {
    console.log('Connecting to MONGODB_URI...');
    await mongoose.connect(process.env.MONGODB_URI.trim());
    console.log('Connected to main DB.');

    const Place = require(path.join(__dirname, '../models/Place'));
    const tphcm = await Place.findOne({ id: 'tphcm' });
    console.log('Place tphcm:', tphcm ? 'Found' : 'NOT FOUND');

    console.log('Connecting to PLANNER_MONGODB_URI...');
    const plannerUri = process.env.PLANNER_MONGODB_URI || process.env.MONGODB_URI;
    const plannerDb = mongoose.createConnection(plannerUri);
    
    // Define model on this connection manually for debug
    const itinerarySchema = new mongoose.Schema({}, { strict: false });
    const Itinerary = plannerDb.model('Itinerary', itinerarySchema, 'itineraries');

    const itin1 = await Itinerary.findOne({ _id: new mongoose.Types.ObjectId('24ec4c9ecf9e06cdd') });
    console.log('Itin 24ec...:', itin1 ? 'Found' : 'NOT FOUND');

    const itin2 = await Itinerary.findOne({ _id: new mongoose.Types.ObjectId('69eaa070aaf4e21834cf1168') });
    console.log('Itin 69eaa...:', itin2 ? 'Found' : 'NOT FOUND');

    const allItins = await Itinerary.find().limit(5);
    console.log('Recent Itins IDs:', allItins.map(i => i._id));

    process.exit(0);
  } catch (err) {
    console.error('Debug Error:', err);
    process.exit(1);
  }
}

debug();
