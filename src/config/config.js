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
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    senderAddress: process.env.SENDER_ADDRESS,
  },
  verification: {
    emailKey: process.env.EMAIL_VERIFICATION_KEY,
    phoneKey: process.env.PHONE_VERIFICATION_KEY,
  },
};

const requiredConfig = [
  'server.port',
  'database.url',
  'auth.jwtSecretKey',
  'smtp.host',
  'smtp.port',
  'smtp.username',
  'smtp.password',
  'smtp.senderAddress',
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
