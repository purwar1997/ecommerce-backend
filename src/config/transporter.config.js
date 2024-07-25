import nodemailer from 'nodemailer';
import config from './env.config.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false,
  auth: {
    user: config.smtp.username,
    pass: config.smtp.password,
  },
});

export default transporter;
