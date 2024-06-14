import Joi from 'joi';
import { nameRegex, phoneRegex, passwordRegex } from '../utils/regex.js';
import { stripConfirmPassword } from '../utils/helpers.js';

const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email({ maxDomainSegments: 2, tlds: { allow: false } })
  .required()
  .messages({
    'string.empty': 'Email address is required',
    'string.email': 'Please provide a valid email address',
  });

const newPasswordSchema = Joi.string().pattern(passwordRegex).required().messages({
  'string.empty': 'Password is required',
  'string.pattern.base':
    'Password must be 6-20 characters long and should contain atleast one digit, one letter and one special character',
});

const confirmPasswordSchema = Joi.any().valid(Joi.ref('password')).required().messages({
  'any.required': 'Confirm password is required',
  'any.only': "Confirm password doesn't match with password",
});

export const signupSchema = Joi.object({
  firstname: Joi.string().trim().pattern(nameRegex).max(50).required().messages({
    'string.empty': 'Firstname is required',
    'string.pattern.base': 'First name must contain only alphabets',
    'string.max': 'First name cannot exceed 50 characters',
  }),

  lastname: Joi.string().trim().pattern(nameRegex).max(50).allow('').messages({
    'string.pattern.base': 'Last name must contain only alphabets',
    'string.max': 'Last name cannot exceed 50 characters',
  }),

  email: emailSchema,

  phone: Joi.string().trim().pattern(phoneRegex).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Please provide a valid phone number',
  }),

  password: newPasswordSchema,
  confirmPassword: confirmPasswordSchema,
}).custom(stripConfirmPassword);

export const loginSchema = Joi.object({
  email: emailSchema,

  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

export const resetPasswordSchema = Joi.object({
  password: newPasswordSchema,
  confirmPassword: confirmPasswordSchema,
});
