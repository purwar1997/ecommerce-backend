import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';

const checkAdminSelfUpdate = handleAsync(async (req, _res, next) => {
  const adminId = req.user._id.toString();

  if (req.params.userId === adminId) {
    throw new CustomError('Admin is not allowed to update their role through this route', 403);
  }

  next();
});

export default checkAdminSelfUpdate;
