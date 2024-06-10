import Joi from 'joi';
import { nameRegex, phoneRegex, passwordRegex } from '../utils/regex.js';
import { stripConfirmPassword } from '../utils/helpers.js';

export const updateUserSchema = Joi.object({
  firstname: Joi.string().trim().pattern(nameRegex).required().messages({
    'string.empty': 'First name is required',
    'string.pattern.base': 'First name must contain only alphabets',
  }),

  lastname: Joi.string().trim().pattern(nameRegex).allow('').messages({
    'string.pattern.base': 'Last name must contain only alphabets',
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
