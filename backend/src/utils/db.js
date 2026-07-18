import mongoose from 'mongoose';

let cachedConnection = null;

export const connectDB = async () => {
  if (cachedConnection) {
    console.log('Using cached database connection');
    return cachedConnection;
  }

  const MONGO_URI = process.env.MONGODB_URI;
  if (!MONGO_URI) {
    console.error('FATAL: MONGODB_URI is not defined in environment variables.');
    throw new Error('MONGODB_URI environment variable is missing');
  }

  try {
    console.log('Creating new database connection...');
    const conn = await mongoose.connect(MONGO_URI);
    cachedConnection = conn;
    console.log('Database connected successfully');
    return cachedConnection;
  } catch (err) {
    console.error('Database connection error:', err.message);
    throw err;
  }
};
