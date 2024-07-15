import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { expectedHttpActions } from '../utils/expectedHttpActions.js';

export const isHttpMethodAllowed = handleAsync((req, res, next) => {
  const allowedMethods = expectedHttpActions[req.path];

  if (!allowedMethods || !allowedMethods.length) {
    throw new CustomError(`No allowed methods defined for this route: ${req.path}`, 500);
  }

  if (!allowedMethods.includes(req.method)) {
    res.set('Allow', allowedMethods.join(', '));

    throw new CustomError(`${req.method} method not allowed on this route`, 405);
  }

  next();
});