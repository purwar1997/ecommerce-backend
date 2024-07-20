import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { nameRegex, phoneRegex, passwordRegex } from '../utils/regex.js';
import { formatOptions, validateOption, validateCommaSeparatedValues } from '../utils/helpers.js';
import { getPathIDSchema, paginationSchema } from './commonSchemas.js';
import { ROLES, USER_SORT_OPTIONS } from '../constants.js';

export const updateUserSchema = customJoi
  .object({
    firstname: Joi.string().trim().pattern(nameRegex).max(50).required().messages({
      'any.required': 'First name is required',
      'string.base': 'First name must be a string',
      'string.empty': 'First name cannot be empty',
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
      'string.base': 'Phone number must be a string',
      'string.empty': 'Phone number cannot be empty',
      'string.pattern.base': 'Please provide a valid phone number',
    }),

    password: Joi.string().pattern(passwordRegex).allow('').messages({
      'string.base': 'Password must be a string',
      'string.pattern.base':
        'Password must be 6-20 characters long and should contain atleast one digit, one letter and one special character',
    }),

    confirmPassword: Joi.any().valid(Joi.ref('password')).strip().messages({
      'any.only': "Confirm password doesn't match with password",
    }),
  })
  .with('password', 'confirmPassword')
  .messages({
    'object.with': 'Confirm password is required',
  });

export const updateRoleSchema = customJoi.object({
  role: Joi.string()
    .trim()
    .lowercase()
    .required()
    .custom(validateOption(ROLES))
    .messages({
      'any.required': 'Role is required',
      'string.base': 'Role must be a string',
      'string.empty': 'Role cannot be empty',
      'any.invalid': `Invalid role. Valid options are: ${formatOptions(ROLES)}`,
    }),
});

export const userQuerySchema = Joi.object({
  roles: Joi.string()
    .trim()
    .empty('')
    .default([])
    .custom(validateCommaSeparatedValues(ROLES))
    .messages({
      'string.base': 'Roles must be a string',
      'any.invalid': `Provided an invalid role. Valid options are: ${formatOptions(ROLES)}`,
    }),

  sort: Joi.string()
    .trim()
    .lowercase()
    .allow('')
    .custom(validateOption(USER_SORT_OPTIONS))
    .messages({
      'string.base': 'Sort option must be a string',
      'any.invalid': `Provided an invalid sort value. Valid options are: ${formatOptions(
        USER_SORT_OPTIONS
      )}`,
    }),

  page: paginationSchema,
});

export const userIdSchema = Joi.object({
  userId: getPathIDSchema('User ID'),
});
