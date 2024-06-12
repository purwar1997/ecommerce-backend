import User from '../models/user.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';
import { serializeDocs } from '../utils/helpers.js';
import { clearCookieOptions } from '../utils/cookieOptions.js';

export const getUserDetails = handleAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select({ cart: 0, wishlist: 0 });

  res.status(200).json({
    success: true,
    message: 'User details fetched successfully',
    user: user.toObject(),
  });
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

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser.toObject(),
  });
});

export const deleteAccount = handleAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { deleted: true }, { runValidators: true });

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

export const updateUserRole = handleAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: userId, deleted: false },
    { role },
    { runValidators: true, new: true }
  );

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User role updated sucessfully',
    user: user.toObject(),
  });
});

export const deleteUser = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOneAndUpdate(
    { _id: userId, deleted: false },
    { deleted: true },
    { runValidators: true, new: true }
  );

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User deleted sucessfully',
  });
});

export const getOtherAdmins = handleAsync(async (req, res) => {
  const admins = await User.find({ role: 'admin', deleted: false, _id: { $ne: req.user._id } });

  res.status(200).json({
    success: true,
    message: 'Admins other than current admin fetched successfully',
    admins: serializeDocs(admins),
  });
});

export const adminSelfDemote = handleAsync(async (req, res) => {
  const otherAdmins = await User.find({
    role: 'admin',
    deleted: false,
    _id: { $ne: req.user._id },
  });

  if (!otherAdmins.length) {
    throw new CustomError(
      'You are the only admin. Promote another user before demoting yourself.',
      409
    );
  }

  const admin = await User.findByIdAndUpdate(
    req.user._id,
    { role: 'user' },
    { runValidators: true, new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Admin role demoted to user successfully',
    admin: admin.toObject(),
  });
});

export const adminSelfDelete = handleAsync(async (req, res) => {
  const otherAdmins = await User.find({
    role: 'admin',
    deleted: false,
    _id: { $ne: req.user._id },
  });

  if (!otherAdmins.length) {
    throw new CustomError(
      'You are the only admin. Promote another user before deleting yourself.',
      409
    );
  }

  await User.findByIdAndUpdate(req.user._id, { deleted: true }, { runValidators: true, new: true });

  res.clearCookie('token', clearCookieOptions).status(200).json({
    success: true,
    message: 'Admin deleted sucessfully',
  });
});