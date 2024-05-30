import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 8000,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};

export default config;
