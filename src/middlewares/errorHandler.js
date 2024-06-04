import CustomError from '../utils/customError.js';

const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  err.message = err.message || 'Internal server error';
  err.code = err.code || 500;

  if (err.name === 'JSONWebTokenError') {
    const message = 'Invalid token';
    err = new CustomError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    err = new CustomError(message, 401);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(error => error.message)
      .join('. ');

    err = new CustomError(message, 400);
  }

  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    err = new CustomError(message, 400);
  }

  if (err.code === 11000) {
    const message = `${Object.keys(err.keyPattern)[0]} already exists`;
    err = new CustomError(message, 400);
  }

  if (err.code < 100 || err.code > 599) {
    err.code = 500;
  }

  res.status(err.code).json({
    success: false,
    message: err.message,
  });
};

export default errorHandler;
