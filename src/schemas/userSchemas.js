import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { nameRegex, phoneRegex, passwordRegex } from '../utils/regex.js';
import { stripConfirmPassword } from '../utils/helpers.js';
import { ROLES } from '../constants.js';

export const updateUserSchema = customJoi
  .object({
    firstname: Joi.string().trim().pattern(nameRegex).max(50).required().messages({
      'any.required': 'First name is required',
      'string.empty': 'First name cannot be empty',
      'string.base': 'First name must be a string',
      'string.pattern.base': 'First name must contain only letters',
      'string.max': 'First name cannot exceed 50 characters',
    }),

    lastname: Joi.string().trim().pattern(nameRegex).max(50).allow('').messages({
      'string.base': 'Last name must be a string',
      'string.pattern.base': 'Last name must contain only letters',
      'string.max': 'Last name cannot exceed 50 characters',
    }),

    phone: Joi.string().trim().pattern(phoneRegex).required().messages({
      'any.required': 'Phone number is required',
      'string.empty': 'Phone number cannot be empty',
      'string.base': 'Phone number must be a string',
      'string.pattern.base': 'Please provide a valid phone number',
    }),

    password: Joi.string().pattern(passwordRegex).allow('').messages({
      'string.base': 'Password must be a string',
      'string.pattern.base':
        'Password must be 6-20 characters long and should contain atleast one digit, one letter and one special character',
    }),

    confirmPassword: Joi.any().valid(Joi.ref('password')).messages({
      'any.only': "Confirm password doesn't match with password",
    }),
  })
  .with('password', 'confirmPassword')
  .custom(stripConfirmPassword)
  .messages({
    'object.with': 'Confirm password is required',
  });

export const updateRoleSchema = customJoi.object({
  role: Joi.string()
    .trim()
    .lowercase()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      'any.required': 'Role is required',
      'string.empty': 'Role cannot be empty',
      'string.base': 'Role must be a string',
      'any.only': 'Invalid role. Valid options are user and admin',
    }),
});