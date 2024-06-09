import crypto from 'crypto';
import User from '../models/user.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';
import sendMail from '../services/sendMail.js';
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

export const forgotPassword = handleAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError('No user registered with this email', 400);
  }

  const resetPasswordToken = user.generateForgotPasswordToken();

  await user.save({ validateBeforeSave: true });

  const resetPasswordUrl = `${req.protocol}://${req.hostname}/reset-password/${resetPasswordToken}`;

  const messageOptions = {
    recipient: email,
    subject: 'Password reset mail',
    text: `To reset password, copy paste this URL in browser and hit ENTER: ${resetPasswordUrl}`,
  };

  try {
    await sendMail(messageOptions);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: true });
    throw new CustomError('Failure sending mail to the user', 500);
  }

  res.status(200).json({
    success: true,
    message: 'Password reset mail sent successfully',
  });
});

export const resetPassword = handleAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const encryptedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: encryptedToken,
    resetPasswordExpiry: { $gt: new Date() },
  }).select('+password');

  if (!user) {
    throw new CustomError('Reset password token is either invalid or expired', 400);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password has been reset sucessfully',
  });
});
