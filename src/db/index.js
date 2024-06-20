import mongoose from 'mongoose';
import config from '../config/config.js';
import { DATABASE_NAME } from '../constants.js';

const connectDB = async () => {
  try {
    const response = await mongoose.connect(`${config.MONGODB_URL}/${DATABASE_NAME}`);

    console.log(`Database connection success: ${response.connection.host}`);

    mongoose.connection.on('error', err => {
      console.error('ERROR:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Database connection lost');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('Database successfully reconnected');
    });
  } catch (err) {
    console.log('Database connection failed');
    console.error('ERROR:', err);
    process.exit(1);
  }
};

export default connectDB;
