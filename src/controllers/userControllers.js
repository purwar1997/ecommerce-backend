import User from '../models/user.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';
import { serializeDocs } from '../utils/serialize.js';

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
  const { firstname, lastname, phone, password } = req.body;
  const { userId } = req;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  user.firstname = firstname;
  user.lastname = lastname;
  user.phone = phone;

  if (password) {
    user.password = password;
  }

  const updatedUser = await user.save();
  updatedUser.password = undefined;

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user: updatedUser.toObject(),
  });
});

export const deleteAccount = handleAsync(async (req, res) => {});

export const getUsers = handleAsync(async (req, res) => {
  const { page } = req.query;

  const users = await User.find().sort({ createdAt: -1 }).limit(page);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    users: serializeDocs(users),
  });
});

export const getUserById = handleAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'User fetched by ID successfully',
    user: user.toObject(),
  });
});

export const getAllAdmins = handleAsync(async (req, res) => {
  const admins = await User.find({ role: 'admin' });

  res.status(200).json({
    success: true,
    message: 'Admins fetched successfully',
    admins: serializeDocs(admins),
  });
});