const mongoose = require('mongoose');
require('dotenv').config();
const Place = require('./models/Place');
const https = require('https');

async function testUrl(url) {
  if (!url) return false;
  return new Promise((resolve) => {
    https.get(url, (res) => {
       if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve(true);
       } else {
          resolve(false);
       }
    }).on('error', () => resolve(false));
  });
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const places = await Place.find({});
  let brokenImages = [];
  let brokenUrls = [];
  
  for (let place of places) {
    const isImageOk = await testUrl(place.image);
    if (!isImageOk) brokenImages.push(place.id);
    
    // Unsplash sometimes redirects, but 404 is bad. 
    // Source URLs
    if (place.sourceUrl) {
      // test source URL (Note: might need http instead of https for some, just checking)
      const isUrlOk = await testUrl(place.sourceUrl.replace('http://', 'https://'));
      if (!isUrlOk) brokenUrls.push({ id: place.id, url: place.sourceUrl });
    }
  }
  
  console.log("Broken Images:", brokenImages);
  console.log("Broken Links:", brokenUrls);
  
  process.exit();
}

run();
