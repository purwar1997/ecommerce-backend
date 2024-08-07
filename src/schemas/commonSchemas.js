import Joi from 'joi';
import { validateObjectIdAsPathParams, validateRouteParams } from '../utils/joiValidators.js';
import { SAFE_INTEGER } from '../constants/common.js';

export const getPathIDSchema = param =>
  Joi.string()
    .trim()
    .custom(validateObjectIdAsPathParams)
    .messages({
      'string.base': `${param} must be a string`,
      'string.empty': `${param} is required`,
      'any.invalid': `${param} is invalid. Expected a valid objectId`,
    });

export const getPathParamSchema = param =>
  Joi.string()
    .trim()
    .custom(validateRouteParams)
    .messages({
      'string.base': `${param} must be a string`,
      'string.empty': `${param} is required`,
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