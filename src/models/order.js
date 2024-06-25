import mongoose from 'mongoose';
import { roundTwoDecimals, formatOptions } from '../utils/helpers.js';
import { couponCodeRegex } from '../utils/regex.js';
import {
  MIN_QUANTITY,
  MAX_QUANTITY,
  MIN_PRICE,
  MAX_PRICE,
  MIN_SHIPPING_CHARGE,
  ORDER_STATUS,
  PAYMENT_METHODS,
} from '../constants.js';

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [MIN_QUANTITY, `Quantity must be at least ${MIN_QUANTITY}`],
    max: [MAX_QUANTITY, `Quantity must be at most ${MAX_QUANTITY}`],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be an integer',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [MIN_PRICE, `Price must be at least ₹${MIN_PRICE}`],
    max: [MAX_PRICE, `Price must be at most ₹${MAX_PRICE}`],
    set: roundTwoDecimals,
  },
});

const orderSchema = new Schema(
  {
    items: {
      type: [orderItemSchema],
      validate: {
        validator: items => items.length > 0,
        message: 'Items array must have at least one order item',
      },
    },
    orderAmount: {
      type: Number,
      required: [true, 'Order amount is required'],
      min: [MIN_PRICE, `Order amount must be at least ₹${MIN_PRICE}`],
      set: roundTwoDecimals,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount value cannot be negative'],
      set: roundTwoDecimals,
    },
    shippingCharges: {
      type: Number,
      required: [true, 'Shipping charges are required'],
      min: [MIN_SHIPPING_CHARGE, `Shipping charges must be at least ₹${MIN_SHIPPING_CHARGE}`],
      set: roundTwoDecimals,
    },
    taxAmount: {
      type: Number,
      required: [true, 'Tax amount is required'],
      min: [0, 'Tax amount cannot be negative'],
      set: roundTwoDecimals,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
      set: roundTwoDecimals,
    },
    coupon: {
      type: String,
      match: [
        couponCodeRegex,
        'Coupon code must be 5-15 characters long, start with a letter, and contain only uppercase letters and digits',
      ],
    },
    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: [true, 'Shipping address is required'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: Object.values(PAYMENT_METHODS),
        message: `Invalid payment method. Valid options are: ${formatOptions(PAYMENT_METHODS)}`,
      },
    },
    status: {
      type: String,
      default: ORDER_STATUS.PENDING,
      enum: {
        values: Object.values(ORDER_STATUS),
        message: `Invalid order status. Valid options are: ${formatOptions(ORDER_STATUS)}`,
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The ID of the user who placed this order is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    statusLastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: Date,
    statusUpdatedAt: Date,
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
    },
  }
);

export default mongoose.model('Order', orderSchema);
