import mongoose from 'mongoose';
import { couponCodeRegex } from '../utils/regex.js';
import { formatOptions } from '../utils/helpers.js';
import {
  DISCOUNT_TYPES,
  MIN_FLAT_DISCOUNT,
  MAX_FLAT_DISCOUNT,
  FLAT_DISCOUNT_MULTIPLE,
  MIN_PERCENTAGE_DISCOUNT,
  MAX_PERCENTAGE_DISCOUNT,
} from '../constants.js';

const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      required: [true, 'Coupon code is required'],
      match: [
        couponCodeRegex,
        'Coupon code must be 5-15 characters long, start with a letter, and contain only uppercase letters and digits',
      ],
    },
    discountType: {
      type: String,
      required: [true, 'Discount type is required'],
      enum: {
        values: Object.values(DISCOUNT_TYPES),
        message: `Invalid discount type. Valid options are: ${formatOptions(DISCOUNT_TYPES)}`,
      },
    },
    flatDiscount: {
      type: Number,
      required: [
        function () {
          return this.discountType === DISCOUNT_TYPES.FLAT;
        },
        'Flat discount is required when discount type is flat',
      ],
      min: [MIN_FLAT_DISCOUNT, `Flat discount must be at least ${MIN_FLAT_DISCOUNT}`],
      max: [MAX_FLAT_DISCOUNT, `Flat discount must be at most ${MAX_FLAT_DISCOUNT}`],
      validate: {
        validator: discount => discount % FLAT_DISCOUNT_MULTIPLE === 0,
        message: `Flat discount must be a multiple of ${FLAT_DISCOUNT_MULTIPLE}`,
      },
    },
    percentageDiscount: {
      type: Number,
      required: [
        function () {
          return this.discountType === DISCOUNT_TYPES.PERCENTAGE;
        },
        'Percentage discount is required when discount type is percentage',
      ],
      min: [
        MIN_PERCENTAGE_DISCOUNT,
        `Percentage discount must be at least ${MIN_PERCENTAGE_DISCOUNT}%`,
      ],
      max: [
        MAX_PERCENTAGE_DISCOUNT,
        `Percentage discount must be at most ${MAX_PERCENTAGE_DISCOUNT}%`,
      ],
      validate: {
        validator: Number.isInteger,
        message: `Percentage discount must be an integer`,
      },
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
      validate: {
        validator: date => date > Date.now(),
        message: 'Expiry date must be in the future',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The ID of the user who created this coupon is required'],
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    activeStatusLastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
    },
  }
);

couponSchema.pre('save', function (next) {
  if (this.discountType === DISCOUNT_TYPES.FLAT) {
    this.percentageDiscount = undefined;
  } else {
    this.flatDiscount = undefined;
  }

  next();
});

export default mongoose.model('Coupon', couponSchema);
