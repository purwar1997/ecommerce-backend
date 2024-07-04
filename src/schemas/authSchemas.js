import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { nameRegex, phoneRegex, passwordRegex } from '../utils/regex.js';

const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email({ maxDomainSegments: 2, tlds: { allow: false } })
  .required()
  .messages({
    'any.required': 'Email address is required',
    'string.empty': 'Email address cannot be empty',
    'string.base': 'Email address must be a string',
    'string.email': 'Please provide a valid email address',
  });

const newPasswordSchema = Joi.string().pattern(passwordRegex).required().messages({
  'any.required': 'Password is required',
  'string.empty': 'Password cannot be empty',
  'string.base': 'Password must be string',
  'string.pattern.base':
    'Password must be 6-20 characters long and should contain atleast one digit, one letter and one special character',
});

const confirmPasswordSchema = Joi.any().valid(Joi.ref('password')).required().strip().messages({
  'any.required': 'Confirm password is required',
  'any.only': "Confirm password doesn't match with password",
});

export const signupSchema = customJoi.object({
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

  email: emailSchema,

  phone: Joi.string().trim().pattern(phoneRegex).required().messages({
    'any.required': 'Phone number is required',
    'string.empty': 'Phone number cannot be empty',
    'string.base': 'Phone number must be a string',
    'string.pattern.base': 'Please provide a valid phone number',
  }),

  password: newPasswordSchema,
  confirmPassword: confirmPasswordSchema,
});

export const loginSchema = customJoi.object({
  email: emailSchema,

  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty',
    'string.base': 'Password must be a string',
  }),
});

export const forgotPasswordSchema = customJoi.object({
  email: emailSchema,
});

export const resetPasswordSchema = customJoi.object({
  password: newPasswordSchema,
  confirmPassword: confirmPasswordSchema,
});
