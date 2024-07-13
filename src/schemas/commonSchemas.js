import Joi from 'joi';
import { validatePathId } from '../utils/helpers.js';
import { MAX_SAFE_INTEGER } from '../constants.js';

export const createIDSchema = path =>
  Joi.string()
    .trim()
    .custom(validatePathId)
    .messages({
      'string.base': `${path} must be a string`,
      'string.empty': `${path} is required`,
      'any.invalid': `Invalid ID format. ${path} must be a valid ObjectId`,
    });

export const paginationSchema = Joi.number()
  .integer()
  .unsafe()
  .min(1)
  .max(MAX_SAFE_INTEGER)
  .empty('')
  .default(1)
  .messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1',
    'number.max': `Page must be less than or equal to ${MAX_SAFE_INTEGER}`,
  });