require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

const FIXED = {
  "phu-quoc":      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
  "hoi-an":        "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=800&q=80",
  "sa-pa":         "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
  "ha-long":       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "ha-noi":        "https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=80",
  "da-lat":        "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&q=80",
  "da-nang":       "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80",
  "nha-trang":     "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
  "can-tho":       "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
  "ninh-binh":     "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  "hue":           "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
  "ha-giang":      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "con-dao":       "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&q=80",
  "quy-nhon":      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
  "phan-thiet":    "https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800&q=80",
  "tphcm":         "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
  "buon-ma-thuot": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  "tam-dao":       "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80",
  "mui-ne-fantasy":"https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80",
  "sapa-fansipan": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
  "moc-chau":      "https://images.unsplash.com/photo-1467377791767-c929b5dc9a23?w=800&q=80",
  "phong-nha":     "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "pu-luong":      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
  "phu-yen":       "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  for (const [id, image] of Object.entries(FIXED)) {
    const r = await Place.findOneAndUpdate({ id }, { image }, { new: true });
    if (r) console.log(`✅ Updated ${id}`);
    else console.log(`❌ Not found: ${id}`);
  }
  await mongoose.disconnect();
  console.log('Done.');
}
run();
