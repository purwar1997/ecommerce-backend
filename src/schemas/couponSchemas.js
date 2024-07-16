import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { couponCodeRegex } from '../utils/regex.js';
import { formatOptions, validateOption } from '../utils/helpers.js';
import { paginationSchema, createIDSchema } from './commonSchemas.js';
import { DISCOUNT_TYPES, DISCOUNT, COUPON_STATES } from '../constants.js';

export const couponSchema = customJoi.object({
  code: Joi.string().trim().uppercase().pattern(couponCodeRegex).required().messages({
    'any.required': 'Coupon code is required',
    'string.base': 'Coupon code must be a string',
    'string.empty': 'Coupon code cannot be empty',
    'string.pattern.base':
      'Coupon code must be 5-15 characters long, start with a letter, and contain only uppercase letters and digits',
  }),

  discountType: Joi.string()
    .trim()
    .lowercase()
    .required()
    .custom(validateOption(DISCOUNT_TYPES))
    .messages({
      'any.required': 'Discount type is required',
      'string.base': 'Discount type must be a string',
      'string.empty': 'Discount type cannot be empty',
      'any.invalid': `Invalid discount type. Valid options are: ${formatOptions(DISCOUNT_TYPES)}`,
    }),

  flatDiscount: Joi.number()
    .min(DISCOUNT.MIN_FLAT)
    .max(DISCOUNT.MAX_FLAT)
    .multiple(DISCOUNT.FLAT_MULTIPLE)
    .unsafe()
    .when('discountType', {
      is: DISCOUNT_TYPES.FLAT,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      'any.required': 'Flat discount is required when discount type is flat',
      'any.unknown': 'Flat discount not allowed when discount type is percentage',
      'number.base': 'Flat discount must be a number',
      'number.min': `Flat discount must be at least ₹${DISCOUNT.MIN_FLAT}`,
      'number.max': `Flat discount must be at most ₹${DISCOUNT.MAX_FLAT}`,
      'number.multiple': `Flat discount must be a multiple of ${DISCOUNT.FLAT_MULTIPLE}`,
    }),

  percentageDiscount: Joi.number()
    .integer()
    .min(DISCOUNT.MIN_PERCENTAGE)
    .max(DISCOUNT.MAX_PERCENTAGE)
    .unsafe()
    .when('discountType', {
      is: DISCOUNT_TYPES.PERCENTAGE,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({
      'any.required': 'Percentage discount is required when discount type is percentage',
      'any.unknown': 'Percentage discount not allowed when discount type is flat',
      'number.base': 'Percentage discount must be a number',
      'number.integer': 'Percentage discount must be an integer',
      'number.min': `Percentage discount must be at least ${DISCOUNT.MIN_PERCENTAGE}%`,
      'number.max': `Percentage discount must be at most ${DISCOUNT.MAX_PERCENTAGE}%`,
    }),

  expiryDate: Joi.date().iso().greater('now').required().messages({
    'any.required': 'Expiry date is required',
    'date.base': 'Expiry date must be a valid date string',
    'date.format': 'Expiry date must be in ISO 8601 format',
    'date.greater': 'Expiry date must be in the future',
  }),
});

export const couponStateSchema = customJoi.object({
  state: Joi.string()
    .trim()
    .lowercase()
    .required()
    .custom(validateOption(COUPON_STATES))
    .messages({
      'any.required': 'Coupon state is required',
      'string.base': 'Coupon state must be a string',
      'string.empty': 'Coupon state cannot be empty',
      'any.invalid': `Invalid coupon state. Valid options are: ${formatOptions(COUPON_STATES)}`,
    }),
});

export const couponCodeSchema = Joi.object({
  code: Joi.string().trim().uppercase().required().messages({
    'any.required': 'Coupon code is required',
    'string.base': 'Coupon code must be a string',
    'string.empty': 'Coupon code cannot be empty',
  }),
});

export const couponQuerySchema = Joi.object({
  page: paginationSchema,
});

export const couponIdSchema = Joi.object({
  couponId: createIDSchema('Coupon ID'),
});