import mongoose from 'mongoose';
import CustomError from '../utils/customError.js';
import { roundTwoDecimals } from '../utils/helpers.js';
import {
  MIN_QUANTITY,
  MAX_QUANTITY,
  MIN_PRICE,
  MAX_PRICE,
  MIN_SHIPPING_CHARGE,
  GST_RATE,
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
        validator: v => v.length > 0,
        message: 'Items array must have at least one order item',
      },
    },
    orderAmount: {
      type: Number,
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
      min: [0, 'Tax amount cannot be negative'],
      set: roundTwoDecimals,
    },
    totalAmount: {
      type: Number,
      min: [0, 'Total amount cannot be negative'],
      set: roundTwoDecimals,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
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
        message: 'Invalid payment method',
      },
    },
    orderStatus: {
      type: String,
      default: ORDER_STATUS.PENDING,
      enum: {
        values: Object.values(ORDER_STATUS),
        message: 'Invalid order status',
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
    statusUpdatedBy: {
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

orderSchema.pre('save', function (next) {
  this.orderAmount = this.items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (this.orderAmount < MIN_PRICE) {
    return next(new CustomError(`Order amount must be at least ₹${MIN_PRICE}`, 400));
  }

  if (this.shippingCharges < MIN_SHIPPING_CHARGE) {
    return next(new CustomError(`Shipping charges must be at least ₹${MIN_SHIPPING_CHARGE}`, 400));
  }

  this.taxAmount = this.orderAmount * GST_RATE + this.shippingCharges * GST_RATE;
  this.totalAmount = this.orderAmount + this.shippingCharges + this.taxAmount;

  next();
});

export default mongoose.model('Order', orderSchema);
