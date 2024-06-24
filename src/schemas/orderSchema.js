import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { isObjectIdValid, roundToTwoDecimalPlaces, stripEmptyKeys } from '../utils/helpers.js';
import { couponCodeRegex } from '../utils/regex.js';
import {
  MIN_QUANTITY,
  MAX_QUANTITY,
  MIN_PRICE,
  MAX_PRICE,
  MIN_SHIPPING_CHARGE,
  PAYMENT_METHODS,
} from '../constants.js';

const orderItemSchema = Joi.object({
  product: Joi.string().trim().required().custom(isObjectIdValid).messages({
    'any.required': 'Product is required',
    'string.empty': 'Product cannot be empty',
    'string.base': 'Product must be a string',
    'any.invalid': 'Invalid value provided for product. Expected a valid ObjectId',
  }),

  quantity: Joi.number()
    .integer()
    .min(MIN_QUANTITY)
    .max(MAX_QUANTITY)
    .required()
    .messages({
      'any.required': 'Quantity is required',
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': `Quantity must be at least ${MIN_QUANTITY}`,
      'number.max': `Quantity must be at most ${MAX_QUANTITY}`,
    }),

  price: Joi.number()
    .min(MIN_PRICE)
    .max(MAX_PRICE)
    .required()
    .custom(roundToTwoDecimalPlaces)
    .messages({
      'any.required': 'Price is required',
      'number.base': 'Price must be a number',
      'number.min': `Price must be at least ₹${MIN_PRICE}`,
      'number.max': `Price must be at most ₹${MAX_PRICE}`,
    }),
}).messages({
  'object.base': 'Each order item must be an object with product, quantity and price fields',
});

export const createOrderSchema = customJoi
  .object({
    items: Joi.array().items(orderItemSchema).min(1).required().messages({
      'any.required': 'Order items are required',
      'array.base': 'Order items must be an array',
      'array.min': 'Items array must have at least one order item',
    }),

    shippingCharges: Joi.number()
      .min(MIN_SHIPPING_CHARGE)
      .required()
      .custom(roundToTwoDecimalPlaces)
      .messages({
        'any.required': 'Shipping charges are required',
        'number.base': 'Shipping charges must be a number',
        'number.min': `Shipping charges must be at least ₹${MIN_SHIPPING_CHARGE}`,
      }),

    couponCode: Joi.string().trim().pattern(couponCodeRegex).allow('').messages({
      'string.base': 'Coupon code must be a string',
      'string.pattern.base':
        'Coupon code must be 5-15 characters long, contain only uppercase letters and digits, and start with a letter',
    }),

    shippingAddress: Joi.string().trim().required().custom(isObjectIdValid).messages({
      'any.required': 'Shipping address is required',
      'string.empty': 'Shipping address cannot be empty',
      'string.base': 'Shipping address must be a string',
      'any.invalid': 'Invalid value provided for address. Expected a valid ObjectId',
    }),

    paymentMethod: Joi.string()
      .trim()
      .lowercase()
      .valid(...Object.values(PAYMENT_METHODS))
      .required()
      .messages({
        'any.required': 'Payment method is required',
        'string.empty': 'Payment method cannot be empty',
        'string.base': 'Payment method must be a string',
        'any.only':
          'Invalid payment method. Valid options are cash_on_delivery, debit_card and credit_card',
      }),
  })
  .custom(stripEmptyKeys);
