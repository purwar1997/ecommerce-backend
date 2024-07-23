import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { getPathIDSchema, paginationSchema } from './commonSchemas.js';
import {
  validateObjectId,
  roundToTwoDecimalPlaces,
  stripEmptyKeys,
  formatOptions,
  validateOption,
  validateCommaSeparatedValues,
} from '../utils/helpers.js';
import {
  QUANTITY,
  PRICE,
  SHIPPING_CHARGE,
  PAYMENT_METHODS,
  ORDER_DURATION,
  ORDER_SORT_OPTIONS,
  ORDER_STATUS,
} from '../constants.js';

const orderItemSchema = Joi.object({
  product: Joi.string().trim().required().custom(validateObjectId).messages({
    'any.required': 'Product is required',
    'string.empty': 'Product cannot be empty',
    'string.base': 'Product must be a string',
    'any.invalid': 'Invalid value provided for product. Expected a valid objectId',
  }),

  quantity: Joi.number()
    .integer()
    .min(QUANTITY.MIN)
    .max(QUANTITY.MAX)
    .required()
    .unsafe()
    .messages({
      'any.required': 'Quantity is required',
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': `Quantity must be at least ${QUANTITY.MIN}`,
      'number.max': `Quantity must be at most ${QUANTITY.MAX}`,
    }),

  price: Joi.number()
    .min(PRICE.MIN)
    .max(PRICE.MAX)
    .required()
    .unsafe()
    .custom(roundToTwoDecimalPlaces)
    .messages({
      'any.required': 'Price is required',
      'number.base': 'Price must be a number',
      'number.min': `Price must be at least ₹${PRICE.MIN}`,
      'number.max': `Price must be at most ₹${PRICE.MAX}`,
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
      .min(SHIPPING_CHARGE.MIN)
      .required()
      .unsafe()
      .custom(roundToTwoDecimalPlaces)
      .messages({
        'any.required': 'Shipping charges are required',
        'number.base': 'Shipping charges must be a number',
        'number.min': `Shipping charges must be at least ₹${SHIPPING_CHARGE.MIN}`,
      }),

    couponCode: Joi.string().trim().uppercase().allow('').messages({
      'string.base': 'Coupon code must be a string',
    }),

    shippingAddress: Joi.string().trim().required().custom(validateObjectId).messages({
      'any.required': 'Shipping address is required',
      'string.base': 'Shipping address must be a string',
      'string.empty': 'Shipping address cannot be empty',
      'any.invalid': 'Invalid value provided for address. Expected a valid objectId',
    }),

    paymentMethod: Joi.string()
      .trim()
      .lowercase()
      .required()
      .custom(validateOption(PAYMENT_METHODS))
      .messages({
        'any.required': 'Payment method is required',
        'string.base': 'Payment method must be a string',
        'string.empty': 'Payment method cannot be empty',
        'any.invalid': `Invalid payment method. Valid options are: ${formatOptions(
          PAYMENT_METHODS
        )}`,
      }),
  })
  .custom(stripEmptyKeys);

export const ordersQuerySchema = Joi.object({
  duration: Joi.number()
    .integer()
    .min(ORDER_DURATION.MIN)
    .max(ORDER_DURATION.MAX)
    .empty('')
    .default(ORDER_DURATION.DEFAULT)
    .unsafe()
    .messages({
      'number.base': 'Order duration must be a number',
      'number.integer': 'Order duration must be an integer',
      'number.min': `Order duration must be at least ${ORDER_DURATION.MIN}`,
      'number.max': `Order duration must be less than or equal to ${ORDER_DURATION.MAX}`,
    }),

  page: paginationSchema,
});

export const adminOrdersQuerySchema = Joi.object({
  duration: Joi.number()
    .integer()
    .min(ORDER_DURATION.MIN)
    .max(ORDER_DURATION.MAX)
    .empty('')
    .default(ORDER_DURATION.DEFAULT)
    .unsafe()
    .messages({
      'number.base': 'Order duration must be a number',
      'number.integer': 'Order duration must be an integer',
      'number.min': `Order duration must be at least ${ORDER_DURATION.MIN}`,
      'number.max': `Order duration must be less than or equal to ${ORDER_DURATION.MAX}`,
    }),

  status: Joi.string()
    .trim()
    .empty('')
    .default([])
    .custom(validateCommaSeparatedValues(ORDER_STATUS))
    .messages({
      'string.base': 'Order status must be a string',
      'any.invalid': `Provided an invalid order status. Valid options are: ${formatOptions(
        ORDER_STATUS
      )}`,
    }),

  sort: Joi.string()
    .trim()
    .lowercase()
    .empty('')
    .default(ORDER_SORT_OPTIONS.DATE_DESC)
    .custom(validateOption(ORDER_SORT_OPTIONS))
    .messages({
      'string.base': 'Sort option must be a string',
      'any.invalid': `Provided an invalid sort value. Valid options are: ${formatOptions(
        ORDER_SORT_OPTIONS
      )}`,
    }),

  page: paginationSchema,
});

export const orderIdSchema = Joi.object({
  orderId: getPathIDSchema('Order ID'),
});