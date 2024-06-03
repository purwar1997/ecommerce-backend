import handleAsync from '../services/handleAsync.js';

export const getUserDetails = handleAsync(async (_req, res) => {
  const { user } = res;

  res.status(200).json({
    success: true,
    message: 'User details successfully fetched',
    user: user.toObject({ virtuals: true }),
  });
});
