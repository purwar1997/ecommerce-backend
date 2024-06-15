import Joi from 'joi';

export const addReviewSchema = Joi.object({
  rating: Joi.number().valid(1, 2, 3, 4, 5).required().messages({
    'any.required': 'Please provide a rating',
    'any.only': 'Please provide an integer rating between 1 and 5',
  }),
  headline: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Please provide a review headline',
    'string.max': 'Review headline cannot exceed 100 characters',
  }),
  body: Joi.string().trim().max(800).required().messages({
    'string.empty': 'Please provide a review body',
    'string.max': 'Review body cannot exceed 800 characters',
  }),
  product: Joi.string().trim().hex({ prefix: 'optional' }).required().messages({
    'string.base': 'Please provide the ID of the product being reviewed',
    'string.hex': 'Invalid ID format',
  }),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().valid(1, 2, 3, 4, 5).required().messages({
    'any.required': 'Please provide a rating',
    'any.only': 'Please provide an integer rating between 1 and 5',
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
