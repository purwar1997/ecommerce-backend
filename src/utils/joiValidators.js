import mongoose from 'mongoose';

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
