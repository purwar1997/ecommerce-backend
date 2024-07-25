import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { fullnameRegex, phoneRegex, postalCodeRegex } from '../utils/regex.js';
import { removeExtraInnerSpaces } from '../utils/joiSanitizers.js';
import { getPathIDSchema } from './commonSchemas.js';

export const addressSchema = customJoi.object({
  fullname: Joi.string()
    .trim()
    .pattern(fullnameRegex)
    .max(100)
    .required()
    .custom(removeExtraInnerSpaces)
    .messages({
      'any.required': 'Full name is required',
      'string.base': 'Full name must be a string',
      'string.empty': 'Full name cannot be empty',
      'string.pattern.base': 'Full name must contain only letters',
      'string.max': 'Full name cannot exceed 100 characters',
    }),

  phone: Joi.string().trim().pattern(phoneRegex).required().messages({
    'any.required': 'Phone number is required',
    'string.base': 'Phone number must be a string',
    'string.empty': 'Phone number cannot be empty',
    'string.pattern.base': 'Please enter a valid phone number for delivery issues',
  }),

  line1: Joi.string().trim().max(200).required().custom(removeExtraInnerSpaces).messages({
    'any.required': 'Address line 1 is required',
    'string.base': 'Address line 1 must be a string',
    'string.empty': 'Address line 1 cannot be empty',
    'string.max': 'Address line 1 cannot exceed 200 characters',
  }),

  line2: Joi.string().trim().max(200).allow('').custom(removeExtraInnerSpaces).messages({
    'string.base': 'Address line 2 must be a string',
    'string.max': 'Address line 2 cannot exceed 200 characters',
  }),

  landmark: Joi.string().trim().max(200).allow('').custom(removeExtraInnerSpaces).messages({
    'string.base': 'Landmark must be a string',
    'string.max': 'Landmark cannot exceed 200 characters',
  }),

  country: Joi.string().trim().required().messages({
    'any.required': 'Country is required',
    'string.base': 'Country must be a string',
    'string.empty': 'Country cannot be empty',
  }),

  state: Joi.string().trim().required().messages({
    'any.required': 'State is required',
    'string.base': 'State must be a string',
    'string.empty': 'State cannot be empty',
  }),

  city: Joi.string().trim().required().messages({
    'any.required': 'City is required',
    'string.base': 'City must be a string',
    'string.empty': 'City cannot be empty',
  }),

  postalCode: Joi.string().trim().pattern(postalCodeRegex).required().messages({
    'any.required': 'Postal code is required',
    'string.base': 'Postal code must be a string',
    'string.empty': 'Postal code cannot be empty',
    'string.pattern.base': 'Please enter a valid postal code',
  }),

  isDefault: Joi.boolean().default(false).messages({
    'boolean.base': 'isDefault must be a boolean value',
  }),
});

export const addressIdSchema = Joi.object({
  addressId: getPathIDSchema('Address ID'),
});