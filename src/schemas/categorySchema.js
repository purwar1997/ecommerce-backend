import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { removeExtraInnerSpaces } from '../utils/helpers.js';

export const categorySchema = customJoi.object({
  title: Joi.string().trim().max(50).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Category title is required',
    'string.empty': 'Category title cannot be empty',
    'string.base': 'Category title must be a string',
    'string.max': 'Category title cannot exceed 50 characters',
  }),
});
