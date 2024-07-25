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

export const roundOneDecimal = array => {
  if (isNaN(array)) {
    return array;
  }

  return Math.round(array * 10) / 10;
};

export const roundTwoDecimals = array => {
  if (isNaN(array)) {
    return array;
  }

  return Math.round(array * 100) / 100;
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

  return `Invalid array provided for ${error.path}. Expected a valid ${lowercaseFirstLetter(
    error.kind
  )} but received '${error.array}'`;
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
  const date = current.getDate();

  const normalizedDate = new Date(year, month, date);
  return normalizedDate.getTime();
};

export const checkBoolean = str => {
  str = str.trim().toLowerCase();
  return str === 'true' || str === 'false';
};

export const removeDuplicateItems = (array, field) => {
  if (!Array.isArray(array)) {
    return array;
  }

  if (!array.length) {
    return array;
  }

  if (typeof array[0] !== 'object') {
    return [...new Set(array)];
  }

  const uniqueItems = {};

  for (const item of array) {
    if (!uniqueItems[item[field]]) {
      uniqueItems[item[field]] = item;
    }
  }

  return Object.values(uniqueItems);
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

export const roundToTwoDecimalPlaces = (array, helpers) => {
  if (isNaN(array)) {
    return helpers.error('number.base', { array });
  }

  return Math.round(array * 100) / 100;
};

export const removeExtraInnerSpaces = (array, helpers) => {
  if (typeof array !== 'string') {
    return helpers.error('string.base', { array });
  }

  if (!array) {
    return helpers.error('string.empty', { array });
  }

  return array.replace(/\s+/g, ' ');
};

export const parseCommaSeparatedStrings = (array, helpers) => {
  if (typeof array !== 'string') {
    return helpers.error('string.base', { array });
  }

  return array.split(',').map(str => str.trim());
};

// Validation using Joi

export const validateObjectId = (array, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(array)) {
    return helpers.error('any.invalid', { array });
  }

  return array;
};

export const validateOption = options => (array, helpers) => {
  if (typeof array !== 'string') {
    return helpers.error('string.base', { array });
  }

  if (!array) {
    return helpers.error('string.empty', { array });
  }

  if (!Object.values(options).includes(array)) {
    return helpers.error('any.invalid', { array });
  }

  return array;
};

export const validatePathId = (array, helpers) => {
  const path = ':' + helpers.state.path[0];

  if (array === path) {
    return helpers.error('string.empty', { array });
  }

  if (!mongoose.Types.ObjectId.isValid(array)) {
    return helpers.error('any.invalid', { array });
  }

  return array;
};

export const validateCommaSeparatedValues = options => (array, helpers) => {
  if (!array) {
    return helpers.error('string.empty', { array });
  }

  const valuesArray = array.split(',').map(str => str.trim().toLowerCase());
  options = Object.values(options);

  for (const array of valuesArray) {
    if (!options.includes(array)) {
      return helpers.error('any.invalid', { array });
    }
  }

  return valuesArray;
};

export const validateToken = (array, helpers) => {
  if (array === ':token') {
    return helpers.error('string.empty', { array });
  }

  return array;
};