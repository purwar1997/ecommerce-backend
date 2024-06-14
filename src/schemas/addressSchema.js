import Joi from 'joi';
import { fullnameRegex, phoneRegex, postalCodeRegex } from '../utils/regex.js';

export const addressSchema = Joi.object({
  fullname: Joi.string().trim().pattern(fullnameRegex).max(100).required().messages({
    'string.empty': 'Full name is required',
    'string.pattern.base': 'Full name must contain only alphabets',
    'string.max': 'Full name cannot exceed 100 characters',
  }),
  phone: Joi.string().trim().pattern(phoneRegex).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base':
      'Please enter a valid phone number so we can call if there are any issues with delivery',
  }),
  line1: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Address line1 is required',
    'string.max': 'Address line1 cannot exceed 200 characters',
  }),
  line2: Joi.string().trim().max(200).messages({
    'string.max': 'Address line2 cannot exceed 200 characters',
  }),
  landmark: Joi.string().trim().max(200).messages({
    'string.max': 'Landmark cannot exceed 200 characters',
  }),
  country: Joi.string().trim().required().messages({
    'string.empty': 'Country is required',
  }),
  state: Joi.string().trim().required().messages({
    'string.empty': 'State is required',
  }),
  city: Joi.string().trim().required().messages({
    'string.empty': 'City is required',
  }),
  postalCode: Joi.string().trim().pattern(postalCodeRegex).required().messages({
    'string.empty': 'Postal code is required',
    'string.pattern.base': 'Please enter a valid ZIP or postal code',
  }),
  isDefault: Joi.boolean().default(false).messages({
    'boolean.base': 'Only boolean values are allowed',
  }),
});
