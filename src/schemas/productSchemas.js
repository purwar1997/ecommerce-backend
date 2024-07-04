import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import {
  roundToTwoDecimalPlaces,
  validateObjectId,
  removeExtraInnerSpaces,
} from '../utils/helpers.js';
import { MIN_PRICE, MAX_PRICE, MIN_STOCK, MAX_STOCK } from '../constants.js';

export const productSchema = customJoi.object({
  title: Joi.string().trim().max(100).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Product title is required',
    'string.empty': 'Product title cannot be empty',
    'string.base': 'Product title must be a string',
    'string.max': 'Product title cannot exceed 100 characters',
  }),

  description: Joi.string().trim().max(500).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Product description is required',
    'string.empty': 'Product description cannot be empty',
    'string.base': 'Product description must be a string',
    'string.max': 'Product description cannot exceed 500 characters',
  }),

  price: Joi.number()
    .min(MIN_PRICE)
    .max(MAX_PRICE)
    .required()
    .custom(roundToTwoDecimalPlaces)
    .messages({
      'any.required': 'Product price is required',
      'number.base': 'Price must be a number',
      'number.min': `Products priced below ₹${MIN_PRICE} cannot be listed`,
      'number.max': `Products priced above ₹${MAX_PRICE} cannot be listed`,
    }),

  brand: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product brand is required',
    'string.empty': 'Product brand cannot be empty',
    'string.base': 'Product brand must be a string',
    'any.invalid': 'Invalid value provided for brand. Expected a valid ObjectId',
  }),

  category: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product category is required',
    'string.empty': 'Product category cannot be empty',
    'string.base': 'Product category must be a string',
    'any.invalid': 'Invalid value provided for category. Expected a valid ObjectId',
  }),

  stock: Joi.number()
    .integer()
    .min(MIN_STOCK)
    .max(MAX_STOCK)
    .required()
    .messages({
      'any.required': 'Product stock is required',
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': `Stock must be greater than or equal to ${MIN_STOCK}`,
      'number.max': `Stock cannot exceed ${MAX_STOCK} units`,
    }),
});
