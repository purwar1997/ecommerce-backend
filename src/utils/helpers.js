import mongoose from 'mongoose';

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

export const stripConfirmPassword = value => {
  const { confirmPassword, ...rest } = value;
  return rest;
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

export const isObjectIdValid = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { value });
  }

  return value;
};

export const formatCastError = error => {
  if (!(error instanceof mongoose.Error.CastError)) {
    return error.message;
  }

  return `Invalid value provided for ${error.path}. Expected a valid ${lowercaseFirstLetter(
    error.kind
  )} but received '${error.value}'`;
};
