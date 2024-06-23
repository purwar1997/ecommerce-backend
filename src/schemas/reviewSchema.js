import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { MIN_RATING, MAX_RATING } from '../constants.js';

export const reviewSchema = customJoi.object({
  rating: Joi.number()
    .integer()
    .min(MIN_RATING)
    .max(MAX_RATING)
    .required()
    .messages({
      'any.required': 'Rating is required',
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': `Rating must be at least ${MIN_RATING}`,
      'number.max': `Rating must be at most ${MAX_RATING}`,
    }),

  headline: Joi.string().trim().max(100).required().messages({
    'any.required': 'Review headline is required',
    'string.empty': 'Review headline cannot be empty',
    'string.base': 'Review headline must be a string',
    'string.max': 'Review headline cannot exceed 100 characters',
  }),

  body: Joi.string().trim().max(800).required().messages({
    'any.required': 'Review body is required',
    'string.empty': 'Review body cannot be empty',
    'string.base': 'Review body must be a string',
    'string.max': 'Review body cannot exceed 800 characters',
  }),
});
