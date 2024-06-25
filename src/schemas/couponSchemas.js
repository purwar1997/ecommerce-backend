import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { couponCodeRegex } from '../utils/regex.js';
import { formatOptions, stripCouponDiscount } from '../utils/helpers.js';
import {
  DISCOUNT_TYPES,
  FLAT_DISCOUNT_MULTIPLE,
  MAX_FLAT_DISCOUNT,
  MIN_FLAT_DISCOUNT,
  MIN_PERCENTAGE_DISCOUNT,
  MAX_PERCENTAGE_DISCOUNT,
} from '../constants.js';

export const couponSchema = customJoi
  .object({
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
      .valid(...Object.values(DISCOUNT_TYPES))
      .required()
      .messages({
        'any.required': 'Discount type is required',
        'string.base': 'Discount type must be a string',
        'string.empty': 'Discount type cannot be empty',
        'any.only': `Invalid discount type. Valid options are: ${formatOptions(DISCOUNT_TYPES)}`,
      }),

    flatDiscount: Joi.number()
      .min(MIN_FLAT_DISCOUNT)
      .max(MAX_FLAT_DISCOUNT)
      .multiple(FLAT_DISCOUNT_MULTIPLE)
      .when('discountType', {
        is: DISCOUNT_TYPES.FLAT,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      })
      .messages({
        'any.required': 'Flat discount is required when discount type is flat',
        'number.base': 'Flat discount must be a number',
        'number.min': `Flat discount must be at least ${MIN_FLAT_DISCOUNT}`,
        'number.max': `Flat discount must be at most ${MAX_FLAT_DISCOUNT}`,
        'number.multiple': `Flat discount must be a multiple of ${FLAT_DISCOUNT_MULTIPLE}`,
      }),

    percentageDiscount: Joi.number()
      .integer()
      .min(MIN_PERCENTAGE_DISCOUNT)
      .max(MAX_PERCENTAGE_DISCOUNT)
      .when('discountType', {
        is: DISCOUNT_TYPES.PERCENTAGE,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      })
      .messages({
        'any.required': 'Percentage discount is required when discount type is percentage',
        'number.base': 'Percentage discount must be a number',
        'number.integer': 'Percentage discount must be an integer',
        'number.min': `Percentage discount must be at least ${MIN_PERCENTAGE_DISCOUNT}%`,
        'number.max': `Percentage discount must be at most ${MAX_PERCENTAGE_DISCOUNT}%`,
      }),

    expiryDate: Joi.date().iso().greater('now').required().messages({
      'any.required': 'Expiry date is required',
      'date.base': 'Expiry date must be a valid date',
      'date.format': 'Expiry date must be in ISO 8601 format',
      'date.greater': 'Expiry date must be in the future',
    }),
  })
  .custom(stripCouponDiscount, 'Custom validation to strip unnecessary fields');

export const checkCouponValiditySchema = customJoi.object({
  couponCode: Joi.string().trim().uppercase().required().messages({
    'any.required': 'Coupon code is required',
    'string.base': 'Coupon code must be a string',
    'string.empty': 'Coupon code cannot be empty',
  }),
});