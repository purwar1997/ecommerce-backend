import { v2 as cloudinary } from 'cloudinary';
import config from './config.js';
import { CLOUD_NAME } from '../constants.js';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
  hide_sensitive: true,
});

export default cloudinary;
