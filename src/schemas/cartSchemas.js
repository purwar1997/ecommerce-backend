import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { validateObjectId } from '../utils/helpers.js';

export const productIdSchema = customJoi.object({
  productId: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product ID is required',
    'string.base': 'Product ID must be a string',
    'string.empty': 'Product ID cannot be empty',
    'any.invalid': 'Invalid ID format. Expected a valid objectID',
  }),
});

export const quantitySchema = customJoi.object({
  quantity: Joi.number().integer(),
});
