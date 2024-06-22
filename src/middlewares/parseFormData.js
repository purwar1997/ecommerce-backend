import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';

export const parseFormData = handleAsync((req, res, next) => {
  next();
});
