import Joi from 'joi';
import { validatePathId } from '../utils/joiValidators.js';
import { SAFE_INTEGER } from '../constants.js';

export const getPathIDSchema = path =>
  Joi.string()
    .trim()
    .custom(validatePathId)
    .messages({
      'string.base': `${path} must be a string`,
      'string.empty': `${path} is required`,
      'any.invalid': `Invalid ID format. Expected a valid objectId`,
    });

export const pageSchema = Joi.number()
  .integer()
  .min(1)
  .max(SAFE_INTEGER.MAX)
  .empty('')
  .default(1)
  .unsafe()
  .messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
    'number.max': `Page must be less than or equal to ${SAFE_INTEGER.MAX}`,
  });