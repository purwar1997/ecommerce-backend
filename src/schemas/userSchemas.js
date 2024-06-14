import Joi from 'joi';
import { nameRegex, phoneRegex, passwordRegex } from '../utils/regex.js';
import { stripConfirmPassword } from '../utils/helpers.js';
import { ROLES } from '../constants.js';

export const updateUserSchema = Joi.object({
  firstname: Joi.string().trim().pattern(nameRegex).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.pattern.base': 'First name must contain only alphabets',
    'string.max': 'First name cannot exceed 50 characters',
  }),

  lastname: Joi.string().trim().pattern(nameRegex).max(50).allow('').messages({
    'string.pattern.base': 'Last name must contain only alphabets',
    'string.max': 'Last name cannot exceed 50 characters',
  }),

  phone: Joi.string().trim().pattern(phoneRegex).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Please provide a valid phone number',
  }),

  password: Joi.string().pattern(passwordRegex).allow('').messages({
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

export const updateRoleSchema = Joi.object({
  role: Joi.string().trim().lowercase().valid(ROLES.USER, ROLES.ADMIN).required().messages({
    'string.empty': 'Role is required',
    'any.only': 'Invalid role',
  }),
});