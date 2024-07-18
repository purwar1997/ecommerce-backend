import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { removeExtraInnerSpaces } from '../utils/helpers.js';
import { getPathIDSchema } from './commonSchemas.js';
import { RATING } from '../constants.js';

export const reviewSchema = customJoi.object({
  rating: Joi.number()
    .integer()
    .min(RATING.MIN)
    .max(RATING.MAX)
    .unsafe()
    .required()
    .messages({
      'any.required': 'Rating is required',
      'number.base': 'Rating must be a number',
      'number.integer': 'Rating must be an integer',
      'number.min': `Rating must be at least ${RATING.MIN}`,
      'number.max': `Rating must be at most ${RATING.MAX}`,
    }),

  headline: Joi.string().trim().max(100).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Review headline is required',
    'string.base': 'Review headline must be a string',
    'string.empty': 'Review headline cannot be empty',
    'string.max': 'Review headline cannot exceed 100 characters',
  }),

  body: Joi.string().trim().max(800).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Review body is required',
    'string.base': 'Review body must be a string',
    'string.empty': 'Review body cannot be empty',
    'string.max': 'Review body cannot exceed 800 characters',
  }),
});

export const reviewIdSchema = Joi.object({
  reviewId: getPathIDSchema('Review ID'),
});
