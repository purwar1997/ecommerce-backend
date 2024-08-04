import Joi from 'joi';
import customJoi from '../utils/customJoi.js';
import { getPathParamSchema, pageSchema } from './commonSchemas.js';
import { formatOptions } from '../utils/helperFunctions.js';
import { roundToTwoDecimalPlaces, stripEmptyKeys } from '../utils/joiSanitizers.js';
import {
  validateObjectId,
  validateOption,
  validateCommaSeparatedValues,
} from '../utils/joiValidators.js';
import {
  QUANTITY,
  PRICE,
  SHIPPING_CHARGES,
  ORDER_STATUS,
  DELIVERY_MODES,
} from '../constants/common.js';
import { ORDER_SORT_OPTIONS } from '../constants/sortOptions.js';
import { ORDER_DURATION, FILTER_OPTIONS } from '../constants/filterOptions.js';

const allowedStatusForUpdate = { ...ORDER_STATUS };
delete allowedStatusForUpdate.CREATED;
delete allowedStatusForUpdate.CANCELLED;

const durationSchema = Joi.number()
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
  });

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

export const orderSchema = customJoi
  .object({
    items: Joi.array().items(orderItemSchema).min(1).required().messages({
      'any.required': 'Order items are required',
      'array.base': 'Order items must be an array',
      'array.min': 'Items array must have at least one order item',
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

    deliveryMode: Joi.string()
      .trim()
      .lowercase()
      .required()
      .custom(validateOption(DELIVERY_MODES))
      .messages({
        'any.required': 'Delivery mode is required',
        'string.base': 'Delivery mode must be a string',
        'string.empty': 'Delivery mode cannot be empty',
        'any.invalid': `Invalid delivery mode. Valid options are: ${formatOptions(DELIVERY_MODES)}`,
      }),
  })
  .custom(stripEmptyKeys);

export const confirmOrderSchema = customJoi.object({
  paymentId: Joi.string().trim().required().messages({
    'any.required': 'Payment ID is required',
    'string.base': 'Payment ID must be a string',
    'string.empty': 'Payment ID cannot be empty',
  }),

  paymentSignature: Joi.string().trim().required().messages({
    'any.required': 'Payment signature is required',
    'string.base': 'Payment signature must be a string',
    'string.empty': 'Payment signature cannot be empty',
  }),
});

export const ordersQuerySchema = Joi.object({
  duration: durationSchema,
  page: pageSchema,
});

export const adminOrdersQuerySchema = Joi.object({
  duration: durationSchema,

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

  paid: Joi.string()
    .trim()
    .lowercase()
    .allow('')
    .custom(validateOption(FILTER_OPTIONS))
    .messages({
      'string.base': 'Paid must be a string',
      'any.invalid': `Provided an invalid value for paid. Valid options are: ${formatOptions(
        FILTER_OPTIONS
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

  page: pageSchema,
});

export const orderStatusSchema = customJoi.object({
  status: Joi.string()
    .trim()
    .lowercase()
    .required()
    .custom(validateOption(allowedStatusForUpdate))
    .messages({
      'any.required': 'Order status is required',
      'string.base': 'Order status must be a string',
      'string.empty': 'Order status cannot be empty',
      'any.invalid': `Invalid order status. Valid options are: ${formatOptions(
        allowedStatusForUpdate
      )}`,
    }),
});

export const orderIdSchema = Joi.object({
  orderId: getPathParamSchema('Order ID'),
});