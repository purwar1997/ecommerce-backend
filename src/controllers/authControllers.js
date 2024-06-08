import User from '../models/user.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';
import { setCookieOptions, clearCookieOptions } from '../utils/cookieOptions.js';

export const signup = handleAsync(async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw new CustomError('User with this email already exists', 409);
  }

  const newUser = await User.create({ firstname, lastname, email, phone, password });

  newUser.password = undefined;

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: newUser,
  });
});

export const login = handleAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new CustomError('No user registered with this email', 404);
  }

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    throw new CustomError('Incorrect password', 401);
  }

  const accessToken = user.generateJWTToken();

  res.cookie('token', accessToken, setCookieOptions).status(200).json({
    success: true,
    message: 'User logged in successfully',
  });
});

export const logout = handleAsync(async (_req, res) => {
  res.clearCookie('token', clearCookieOptions).status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});
