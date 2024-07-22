import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { expectedHttpActions } from '../utils/expectedHttpActions.js';

export const isHttpMethodAllowed = handleAsync((req, res, next) => {
  const params = Object.keys(req.params);
  let requestedPath = req.path;

  if (params.length > 0) {
    for (const value of params) {
      requestedPath = requestedPath.replace(req.params[value], ':' + value);
    }
  }

  const allowedMethods = expectedHttpActions[requestedPath];

  if (!allowedMethods || !allowedMethods.length) {
    throw new CustomError(
      `No allowed methods defined for path: ${req.baseUrl + requestedPath}`,
      500
    );
  }

  if (!allowedMethods.includes(req.method)) {
    res.set('Allow', allowedMethods.join(', '));
    throw new CustomError(`${req.method} method not allowed on this route`, 405);
  }

  next();
});
