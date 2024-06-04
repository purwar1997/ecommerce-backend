import User from '../models/User.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';

export const getUserDetails = handleAsync(async (_req, res) => {
  const { user } = res;

  res.status(200).json({
    success: true,
    message: 'User details fetched successfully',
    user: user.toObject({ virtuals: true }),
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
    user: user.toObject({ virtuals: true }),
  });
});
