import User from '../models/user.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';
import { clearCookieOptions } from '../utils/cookieOptions.js';

export const getUserDetails = handleAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select({ cart: 0, wishlist: 0 });

  sendResponse(res, 200, 'User details fetched successfully', user);
});

export const updateProfile = handleAsync(async (req, res) => {
  const updates = req.body;

  if (!updates.password) {
    delete updates.password;
  }

  const anotherUser = await User.findOne({ phone: updates.phone, _id: { $ne: req.user._id } });

  if (anotherUser) {
    throw new CustomError(
      'This phone number is being used by another user. Please set a different phone number',
      400
    );
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    runValidators: true,
    new: true,
  });

  sendResponse(res, 200, 'Profile updated successfully', updatedUser);
});

export const deleteAccount = handleAsync(async (req, res) => {
  const userId = req.user._id;

  await User.findByIdAndUpdate(
    userId,
    { isDeleted: true, deletedBy: userId, deletedAt: Date.now() },
    { runValidators: true }
  );

  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'Account deleted successfully');
});

export const getUsers = handleAsync(async (req, res) => {
  const { page } = req.query;

  const users = await User.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(page);

  sendResponse(res, 200, 'Users fetched successfully', users);
});

export const getUserById = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User fetched by ID successfully', user);
});

export const updateUserRole = handleAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { role, roleUpdatedBy: req.user._id, roleUpdatedAt: Date.now() },
    { runValidators: true, new: true }
  );

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User role updated successfully', user);
});

export const deleteUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { isDeleted: true, deletedBy: req.user._id, deletedAt: Date.now() },
    { runValidators: true, new: true }
  );

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  sendResponse(res, 200, 'User deleted successfully');
});

export const getOtherAdmins = handleAsync(async (req, res) => {
  const admins = await User.find({
    role: 'admin',
    isDeleted: false,
    _id: { $ne: req.user._id },
  });

  sendResponse(res, 200, 'Admins other than current admin fetched successfully', admins);
});

export const adminSelfDemote = handleAsync(async (req, res) => {
  const userId = req.user._id;

  const otherAdmins = await User.find({
    role: 'admin',
    isDeleted: false,
    _id: { $ne: userId },
  });

  if (!otherAdmins.length) {
    throw new CustomError(
      'You are the only admin. Promote another user before demoting yourself.',
      409
    );
  }

  const admin = await User.findByIdAndUpdate(
    userId,
    { role: 'user', roleUpdatedBy: userId, roleUpdatedAt: Date.now() },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'Admin role demoted to user successfully', admin);
});

export const adminSelfDelete = handleAsync(async (req, res) => {
  const userId = req.user._id;

  const otherAdmins = await User.find({
    role: 'admin',
    isDeleted: false,
    _id: { $ne: userId },
  });

  if (!otherAdmins.length) {
    throw new CustomError(
      'You are the only admin. Promote another user before deleting yourself.',
      409
    );
  }

  await User.findByIdAndUpdate(
    userId,
    { isDeleted: true, deletedBy: userId, deletedAt: Date.now() },
    { runValidators: true, new: true }
  );

  res.clearCookie('token', clearCookieOptions);

  sendResponse(res, 200, 'Admin deleted successfully');
});