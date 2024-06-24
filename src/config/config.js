import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 8000,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SENDER_ADDRESS: process.env.SENDER_ADDRESS,
  EMAIL_VERIFICATION_KEY: process.env.EMAIL_VERIFICATION_KEY,
  PHONE_VERIFICATION_KEY: process.env.PHONE_VERIFICATION_KEY,
};

export default config;
