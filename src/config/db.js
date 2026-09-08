import mongoose from 'mongoose';

export const connectDB = async () => {
  let primaryUri = (process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/boo_automotive').trim();
  // Remove wrapping quotes if entered by mistake
  primaryUri = primaryUri.replace(/^["']|["']$/g, '').trim();
  const fallbackUri = 'mongodb://127.0.0.1:27017/boo_automotive';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 6000
    });
    console.log(`[MongoDB] Connected Successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB] Primary connection failed (${error.message}). Attempting local fallback...`);
    try {
      const fallbackConn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 4000
      });
      console.log(`[MongoDB] Connected via Local Fallback: ${fallbackConn.connection.host}/${fallbackConn.connection.name}`);
    } catch (fallbackError) {
      console.error(`[MongoDB] Connection Error: ${fallbackError.message}`);
    }
  }
};
