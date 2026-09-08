import mongoose from 'mongoose';

export const connectDB = async () => {
  let primaryUri = (process.env.MONGO_URI || '').trim().replace(/^["']|["']$/g, '');

  if (!primaryUri) {
    primaryUri = 'mongodb://127.0.0.1:27017/boo_automotive';
  }

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000
    });
    console.log(`[MongoDB] Connected Successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Primary connection failed: ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      try {
        const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/boo_automotive', {
          serverSelectionTimeoutMS: 5000
        });
        console.log(`[MongoDB] Connected via Local Fallback: ${fallbackConn.connection.host}/${fallbackConn.connection.name}`);
      } catch (fallbackError) {
        console.error(`[MongoDB] Local fallback failed: ${fallbackError.message}`);
      }
    }
  }
};

