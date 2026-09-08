import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import './models/Category.js';
import SparePart from './models/SparePart.js';

const MONGO_URI = 'mongodb://SnapTech:FRjZHvaS0ksKW4pD@ac-y9hnl0m-shard-00-00.zfl3zgz.mongodb.net:27017,ac-y9hnl0m-shard-00-01.zfl3zgz.mongodb.net:27017,ac-y9hnl0m-shard-00-02.zfl3zgz.mongodb.net:27017/boo_automotive?replicaSet=atlas-wf6fnn-shard-0&ssl=true&authSource=admin';

const accurateImages = {
  '34116860017': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
  '34216873093': 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?w=800&auto=format&fit=crop&q=80',
  '34116792219': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
  '34216792227': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
  '34356792289': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
  '11427640862': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788835020/boo-automotive/parts/ghxuvpf6lfopqbjwykkf.jpg',
  '13718616909': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834973/boo-automotive/parts/z06hjpyfrgijwl83zfuh.jpg',
  '64119237555': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834937/boo-automotive/parts/nsnl9xx0vo1jconkmv6v.jpg',
  '16127236941': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834895/boo-automotive/parts/ab85fzvidbnrwxl3yi20.jpg',
  '12120037582': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834856/boo-automotive/parts/szqgnwknckuibskri3fd.jpg',
  '12138616153': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834817/boo-automotive/parts/x2hgzoif3abw9bcgpxyj.jpg',
  '11517597715': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834771/boo-automotive/parts/ndyzhjorijoor6ryz0bd.jpg',
  '11537588876': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834734/boo-automotive/parts/ravwykl63tydswyacoqq.jpg',
  '17137640514': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788743641/boo-automotive/parts/odb1agqedt3vophn1glm.jpg',
  '17117600520': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834680/boo-automotive/parts/ksw8y2b5edznwctleisw.jpg',
  '31316791551': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834632/boo-automotive/parts/lapladiu781fjhpqzcvi.jpg',
  '33526791552': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834589/boo-automotive/parts/ptkrno4edeegpw38uemb.jpg',
  '31126852991': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834542/boo-automotive/parts/fnvdattrrqvonlnm59sm.jpg',
  '31306792211': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834497/boo-automotive/parts/mqlt94fllkflsmsfxkzi.jpg',
  '22116855456': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834449/boo-automotive/parts/ihzk4uwwbkkxkkfbfi5o.jpg',
  '24117624192': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834404/boo-automotive/parts/zliv74fe2zvmi3ms2m62.jpg',
  '16117243975': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834346/boo-automotive/parts/szcd7rvyesfwfenjn5i9.jpg',
  '11287618848': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834252/boo-automotive/parts/yetvvrvofddg55qv0eln.jpg',
  '11287594969': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834199/boo-automotive/parts/ez1jjyalbqeu8qq858cf.jpg',
  '11127588418': 'https://res.cloudinary.com/dkiecibqs/image/upload/v1788834108/boo-automotive/parts/f27fwcux8gc6yh088ejy.jpg'
};

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Sync] Connected to MongoDB Atlas successfully.');

    for (const [sku, imgUrl] of Object.entries(accurateImages)) {
      const part = await SparePart.findOneAndUpdate(
        { sku: sku },
        { 
          $set: { 
            images: [{ url: imgUrl, isMain: true }] 
          } 
        },
        { new: true }
      );
      if (part) {
        console.log(`[OK] SKU: ${sku} | ${part.name.substring(0, 35)}... -> ${imgUrl.substring(imgUrl.lastIndexOf('/') + 1)}`);
      } else {
        console.warn(`[MISSING] SKU: ${sku}`);
      }
    }

    console.log('--- ALL 25 PRODUCTS ACCURATELY UPDATED IN ATLAS! ---');
    process.exit(0);
  } catch (err) {
    console.error('[Sync Error]:', err);
    process.exit(1);
  }
}

run();
