import jwt from 'jsonwebtoken';
import handleAsync from '../services/handleAsync.js';
import config from '../config/config.js';
import CustomError from '../utils/customError.js';
import User from '../models/user.js';

const authenticate = handleAsync(async (req, _res, next) => {
  let token;

  if (req.cookies.token || req.headers.authorization?.startsWith('Bearer')) {
    token = req.cookies.token || req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new CustomError('Access denied. Token not provided.', 401);
  }

  const decodedToken = jwt.verify(token, config.JWT_SECRET_KEY);

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new CustomError('Access denied. User not found.', 401);
  }

  req.user = user;
  next();
});

export default authenticate;