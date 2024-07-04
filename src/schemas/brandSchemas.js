import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { removeExtraInnerSpaces } from '../utils/helpers.js';

export const brandSchema = customJoi.object({
  name: Joi.string().trim().max(50).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Brand name is required',
    'string.empty': 'Brand name cannot be empty',
    'string.base': 'Brand name must be a string',
    'string.max': 'Brand name cannot exceed 50 characters',
  }),
});
