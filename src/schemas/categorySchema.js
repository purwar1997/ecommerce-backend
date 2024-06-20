import Joi from 'joi';

export const categorySchema = Joi.object({
  title: Joi.string().trim().max(50).required().messages({
    'any.required': 'Category title is required',
    'string.empty': 'Category title cannot be empty',
    'string.base': 'Category title must be a string',
    'string.max': 'Category title cannot exceed 50 characters',
  }),
});
