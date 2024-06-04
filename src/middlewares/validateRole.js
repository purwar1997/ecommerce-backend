import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';

const validateRole = (...allowedRoles) =>
  handleAsync(async (req, _res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      throw new CustomError("You don't have necessary permissions to access this resource", 403);
    }

    next();
  });

export default validateRole;
