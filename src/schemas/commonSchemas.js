import Joi from 'joi';
import { MAX_SAFE_INTEGER } from '../constants.js';

export const paginationSchema = Joi.object({
  page: Joi.number()
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
    }),
});
