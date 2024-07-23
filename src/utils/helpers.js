import mongoose from 'mongoose';
import pluralize from 'pluralize';
import { format } from 'date-fns';

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

export const capitalizeFirstLetter = str => {
  if (!str) {
    return str;
  }

  return str.at(0).toUpperCase() + str.slice(1);
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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

export const singularize = str => {
  if (!str) {
    return str;
  }

  return pluralize.singular(str);
};

export const getDateString = isoDateStr => format(new Date(isoDateStr), 'MMMM d, YYYY');

export const getCurrentDateMilliSec = () => {
   const current = new Date();
   const year = current.getFullYear();
   const month = current.getMonth();
   const date = current.getDate()

   const normalizedDate = new Date(year, month, date);
   return normalizedDate.getTime()
}

export const checkBoolean = str => {
  str = str.trim().toLowerCase();
  return str === 'true' || str === 'false';
};

// Normalization using Joi

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

export const parseCommaSeparatedStrings = (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.error('string.base', { value });
  }

  return value.split(',').map(str => str.trim());
};

// Validation using Joi

export const validateObjectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { value });
  }

  return value;
};

export const validateOption = options => (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.error('string.base', { value });
  }

  if (!value) {
    return helpers.error('string.empty', { value });
  }

  if (!Object.values(options).includes(value)) {
    return helpers.error('any.invalid', { value });
  }

  return value;
};

export const validatePathId = (value, helpers) => {
  const path = ':' + helpers.state.path[0];

  if (value === path) {
    return helpers.error('string.empty', { value });
  }

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid', { value });
  }

  return value;
};

export const validateCommaSeparatedValues = options => (value, helpers) => {
  if (!value) {
    return helpers.error('string.empty', { value });
  }

  const valuesArray = value.split(',').map(str => str.trim().toLowerCase());
  options = Object.values(options);

  for (const value of valuesArray) {
    if (!options.includes(value)) {
      return helpers.error('any.invalid', { value });
    }
  }

  return valuesArray;
};

export const validateToken = (value, helpers) => {
  if (value === ':token') {
    return helpers.error('string.empty', { value });
  }

  return value;
};