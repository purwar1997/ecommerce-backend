import jwt from 'jsonwebtoken';
import handleAsync from '../services/handleAsync.js';
import config from '../config/config.js';
import CustomError from '../utils/customError.js';
import User from '../models/User.js';

export const authenticate = handleAsync(async (req, res, next) => {
  let token;

  if (req.cookies.token || req.headers.authorization?.startsWith('Bearer')) {
    token = req.cookies.token || req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new CustomError('Access denied. Token not provided', 401);
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET_KEY);
  } catch (err) {
    throw new CustomError(err.message || 'Invalid token', 401);
  }

  const user = await User.findById(decodedToken.userId).select({ cart: 0, wishlist: 0 });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.user = user;
  next();
});
