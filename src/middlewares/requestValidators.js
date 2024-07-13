import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';

const joiValidator = (schema, type) =>
  handleAsync(async (req, _res, next) => {
    const { error, value } = schema.validate(req[type], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      console.log(error);

      const message = error.details.map(errorDetail => errorDetail.message).join('. ');

      throw new CustomError(message, 400);
    }

    req[type] = value;

    console.log(req[type]);

    next();
  });

export const validatePathParams = schema => joiValidator(schema, 'params');
export const validateQueryParams = schema => joiValidator(schema, 'query');
export const validatePayload = schema => joiValidator(schema, 'body');