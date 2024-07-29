import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: {
    port: process.env.PORT || 8000,
  },
  database: {
    url: process.env.MONGODB_URL,
  },
  auth: {
    jwtSecretKey: process.env.JWT_SECRET_KEY,
  },
  gmail: {
    username: process.env.GMAIL_USERNAME,
    password: process.env.GMAIL_PASSWORD,
    senderAddress: process.env.SENDER_ADDRESS,
  },
  verification: {
    emailKey: process.env.EMAIL_VERIFICATION_KEY,
    phoneKey: process.env.PHONE_VERIFICATION_KEY,
  },
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

const requiredConfig = [
  'server.port',
  'database.url',
  'auth.jwtSecretKey',
  'gmail.username',
  'gmail.password',
  'gmail.senderAddress',
  'verification.emailKey',
  'verification.phoneKey',
];

requiredConfig.forEach(key => {
  const keys = key.split('.');
  let value = config;

  for (const k of keys) {
    value = value[k];

    if (value === undefined) {
      throw new Error(`Missing required config value: ${key}`);
    }
  }
});

export default config;
