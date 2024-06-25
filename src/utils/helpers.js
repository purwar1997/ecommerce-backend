import mongoose from 'mongoose';
import { DISCOUNT_TYPES } from '../constants.js';

export const serializeDocs = data => {
  if (!data) {
    return;
  }

  if (!Array.isArray(data)) {
    return data.toObject();
  }

  return data.map(doc => doc.toObject());
};

export const sendResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: serializeDocs(data),
  });
};

export const roundOneDecimal = value => {
  if (isNaN(value)) {
    return value;
  }

  return Math.round(value * 10) / 10;
};

export const roundTwoDecimals = value => {
  if (isNaN(value)) {
    return value;
  }

  return Math.round(value * 100) / 100;
};

export const lowercaseFirstLetter = str => {
  if (!str) {
    return str;
  }

  return str.at(0).toLowerCase() + str.slice(1);
};

export const formatCastError = error => {
  if (!(error instanceof mongoose.Error.CastError)) {
    return error.message;
  }

  return `Invalid value provided for ${error.path}. Expected a valid ${lowercaseFirstLetter(
    error.kind
  )} but received '${error.value}'`;
};

export const formatOptions = options => {
  options = Object.values(options);

  if (options.length === 0) {
    return '';
  }

  if (options.length === 1) {
    return options[0];
  }

  if (options.length === 2) {
    return options.join(' and ');
  }

  const lastOption = options.pop();

  return `${options.join(', ')} and ${lastOption}`;
};

// Custom joi sanitizers

export const stripConfirmPassword = value => {
  const { confirmPassword, ...rest } = value;
  return rest;
};

export const stripCouponDiscount = value => {
  const { discountType } = coupon;

  if (discountType === DISCOUNT_TYPES.FLAT) {
    delete coupon.percentageDiscount;
  } else {
    delete coupon.flatDiscount;
  }

  return value;
};

export const stripEmptyKeys = obj => {
  for (const key in obj) {
    if (!obj[key]) {
      delete obj[key];
    }
  }

  return obj;
};

export const roundToTwoDecimalPlaces = (value, helpers) => {
  if (isNaN(value)) {
    return helpers.error('number.base', { value });
  }

  return Math.round(value * 100) / 100;
};

export const removeExtraInnerSpaces = (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.error('string.base', { value });
  }

  if (!value) {
    return helpers.error('string.empty', { value });
  }

  return value.replace(/\s+/g, ' ');
};

// Custom joi validators

export const isObjectIdValid = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { value });
  }

  return value;
};