import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import './models/Category.js';
import SparePart from './models/SparePart.js';

const MONGO_URI = 'mongodb://SnapTech:FRjZHvaS0ksKW4pD@ac-y9hnl0m-shard-00-00.zfl3zgz.mongodb.net:27017,ac-y9hnl0m-shard-00-01.zfl3zgz.mongodb.net:27017,ac-y9hnl0m-shard-00-02.zfl3zgz.mongodb.net:27017/boo_automotive?replicaSet=atlas-wf6fnn-shard-0&ssl=true&authSource=admin';

const partImageMapping = [
  {
    nameKeyword: 'Front Brake Pads',
    imgUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80'
  },
  {
    nameKeyword: 'Rear Brake Pads',
    imgUrl: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=800&auto=format&fit=crop&q=80'
  },
  {
    nameKeyword: 'Front Brake Rotors',
    imgUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80'
  },
  {
    nameKeyword: 'Rear Brake Rotors',
    imgUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80'
  },
  {
    nameKeyword: 'Front Brake Pad Wear Sensor',
    imgUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
  },
  {
    nameKeyword: 'Engine Oil Filter',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788835020/boo-automotive/parts/ghxuvpf6lfopqbjwykkf.jpg'
  },
  {
    nameKeyword: 'Air Intake Filter',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834973/boo-automotive/parts/z06hjpyfrgijwl83zfuh.jpg'
  },
  {
    nameKeyword: 'Cabin Air Filter',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834937/boo-automotive/parts/nsnl9xx0vo1jconkmv6v.jpg'
  },
  {
    nameKeyword: 'In-Line Fuel Filter',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834895/boo-automotive/parts/ab85fzvidbnrwxl3yi20.jpg'
  },
  {
    nameKeyword: 'Laser Iridium Spark Plugs',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834856/boo-automotive/parts/szqgnwknckuibskri3fd.jpg'
  },
  {
    nameKeyword: 'Direct Ignition Coil',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834817/boo-automotive/parts/x2hgzoif3abw9bcgpxyj.jpg'
  },
  {
    nameKeyword: 'Electric Water Pump',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834771/boo-automotive/parts/ndyzhjorijoor6ryz0bd.jpg'
  },
  {
    nameKeyword: 'Thermostat with Integrated',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834734/boo-automotive/parts/ravwykl63tydswyacoqq.jpg'
  },
  {
    nameKeyword: 'Coolant Expansion Tank',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788743641/boo-automotive/parts/odb1agqedt3vophn1glm.jpg'
  },
  {
    nameKeyword: 'Cooling Aluminum Radiator',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834680/boo-automotive/parts/ksw8y2b5edznwctleisw.jpg'
  },
  {
    nameKeyword: 'Front Gas-Pressure Shock',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834632/boo-automotive/parts/lapladiu781fjhpqzcvi.jpg'
  },
  {
    nameKeyword: 'Rear Gas Shock',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834589/boo-automotive/parts/ptkrno4edeegpw38uemb.jpg'
  },
  {
    nameKeyword: 'Lower Control Arms',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834542/boo-automotive/parts/fnvdattrrqvonlnm59sm.jpg'
  },
  {
    nameKeyword: 'Sway Bar Stabilizer',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834497/boo-automotive/parts/mqlt94fllkflsmsfxkzi.jpg'
  },
  {
    nameKeyword: 'Hydraulic Engine Mounts',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834449/boo-automotive/parts/ihzk4uwwbkkxkkfbfi5o.jpg'
  },
  {
    nameKeyword: 'Transmission Oil Pan',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834404/boo-automotive/parts/zliv74fe2zvmi3ms2m62.jpg'
  },
  {
    nameKeyword: 'In-Tank Electric Fuel Pump',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834346/boo-automotive/parts/szcd7rvyesfwfenjn5i9.jpg'
  },
  {
    nameKeyword: 'Serpentine Accessory Drive Belt',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834252/boo-automotive/parts/yetvvrvofddg55qv0eln.jpg'
  },
  {
    nameKeyword: 'Drive Belt Tensioner',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834199/boo-automotive/parts/ez1jjyalbqeu8qq858cf.jpg'
  },
  {
    nameKeyword: 'Valve Cover Gasket Set',
    imgUrl: 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834108/boo-automotive/parts/f27fwcux8gc6yh088ejy.jpg'
  }
];

async function syncDirect() {
  await mongoose.connect(MONGO_URI);
  console.log('[Direct Sync] Connected to MongoDB Atlas.');

  for (const item of partImageMapping) {
    const updated = await SparePart.findOneAndUpdate(
      { name: { $regex: item.nameKeyword, $options: 'i' } },
      { 
        $set: { 
          images: [{ url: item.imgUrl, isMain: true }] 
        } 
      },
      { new: true }
    );
    if (updated) {
      console.log(`[SUCCESS] Matched: ${updated.name.split('(')[0].trim()} -> ${item.imgUrl}`);
    } else {
      console.warn(`[NOT FOUND]: ${item.nameKeyword}`);
    }
  }

  console.log('[Direct Sync] Finished matching all 25 parts!');
  process.exit(0);
}

syncDirect();
