import mongoose from 'mongoose';

let lastDbError = null;

export const getDbStatus = () => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const rawUri = (process.env.MONGO_URI || '').trim();
  const maskedUri = rawUri ? rawUri.replace(/:([^:@]+)@/, ':****@') : 'NOT_SET';

  return {
    status: states[state] || 'unknown',
    readyState: state,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
    configuredUri: maskedUri,
    lastError: lastDbError
  };
};

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
    lastDbError = null;
    console.log(`[MongoDB] Connected Successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    lastDbError = error.message;
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

