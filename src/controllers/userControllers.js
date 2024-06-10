import User from '../models/user.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';
import { serializeDocs } from '../utils/helpers.js';
import { clearCookieOptions } from '../utils/cookieOptions.js';

export const getUserDetails = handleAsync(async (req, res) => {
  const { userId } = req;

  const user = await User.findById(userId).select({ cart: 0, wishlist: 0 });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User details fetched successfully',
    user: user.toObject(),
  });
});

export const updateUser = handleAsync(async (req, res) => {
  const { userId } = req;
  const updates = req.body;

  if (!updates.password) {
    delete updates.password;
  }

  const anotherUser = await User.findOne({ phone: updates.phone, _id: { $ne: userId } });

  if (anotherUser) {
    throw new CustomError(
      'This phone number is being used by another user. Please set a different phone number',
      400
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    runValidators: true,
    new: true,
  });

  if (!updatedUser) {
    throw new CustomError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user: updatedUser.toObject(),
  });
});

export const deleteAccount = handleAsync(async (req, res) => {
  const { userId } = req;

  const user = await User.findByIdAndUpdate(userId, { deleted: true }, { runValidators: true });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.clearCookie('token', clearCookieOptions).status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});

export const getUsers = handleAsync(async (req, res) => {
  const { page } = req.query;

  const users = await User.find({ deleted: false }).sort({ createdAt: -1 }).limit(page);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    users: serializeDocs(users),
  });
});

export const getUserById = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOne({ _id: userId, deleted: false });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User fetched by ID successfully',
    user: user.toObject(),
  });
});

export const getAllAdmins = handleAsync(async (_req, res) => {
  const admins = await User.find({ role: 'admin', deleted: false });

  res.status(200).json({
    success: true,
    message: 'Admins fetched successfully',
    admins: serializeDocs(admins),
  });
});