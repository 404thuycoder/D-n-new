const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI.trim());
    console.log('Connected to MongoDB');
    
    const Place = mongoose.model('Place', new mongoose.Schema({ 
      ownerId: String, 
      name: String,
      status: String 
    }, { strict: false }));
    
    const count = await Place.countDocuments({ ownerId: { $ne: null } });
    console.log('Total business services (with ownerId):', count);
    
    const approvedCount = await Place.countDocuments({ ownerId: { $ne: null }, status: 'approved' });
    console.log('Approved business services:', approvedCount);
    
    const examples = await Place.find({ ownerId: { $ne: null } }).limit(3);
    console.log('Sample Business Places:', JSON.stringify(examples, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
