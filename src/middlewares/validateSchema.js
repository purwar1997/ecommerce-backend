import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';

const validateSchema = schema =>
  handleAsync((req, _res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      console.log(error);

      const message = error.details.map(errorDetail => errorDetail.message).join('. ');

      throw new CustomError(message, 400);
    }

    req.body = value;
    next();
  });

export default validateSchema;
