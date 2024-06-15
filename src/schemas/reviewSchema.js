import Joi from 'joi';

export const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'any.required': 'Please provide a rating',
    'number.base': 'Rating must be a number',
    'number.integer': 'Rating must be an integer',
    'number.min': 'Rating must be between 1 and 5 inclusive',
    'number.max': 'Rating must be between 1 and 5 inclusive',
  }),
  headline: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Please provide a review headline',
    'string.max': 'Review headline cannot exceed 100 characters',
  }),
  body: Joi.string().trim().max(800).required().messages({
    'string.empty': 'Please provide a review body',
    'string.max': 'Review body cannot exceed 800 characters',
  }),
});
