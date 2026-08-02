import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digital-growth-platform';
    console.log(`Connecting to MongoDB at: ${connUri}...`);
    
    // Connect with a 4-second timeout to avoid hanging if MongoDB isn't running
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 4000
    });
    
    isConnected = true;
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`\n[WARNING] MongoDB Connection Failed: ${error.message}`);
    console.warn('The application will run using a robust in-memory database fallback.');
    console.warn('Please start MongoDB locally if you want persistent database storage.\n');
    isConnected = false;
    return false;
  }
};

export const getDbStatus = () => isConnected;
