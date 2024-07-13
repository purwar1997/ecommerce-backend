import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';

export const validatePayload = schema =>
  handleAsync((req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.log(error);

      const message = error.details.map(errorDetail => errorDetail.message).join('. ');

      throw new CustomError(message, 400);
    }

    req.body = value;

    console.log(req.body);

    next();
  });

export const validateQueryParams = schema =>
  handleAsync(async (req, _res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.log(error);

      const message = error.details.map(errorDetail => errorDetail.message).join('. ');

      throw new CustomError(message, 400);
    }

    req.query = value;

    console.log(req.query);

    next();
  });
