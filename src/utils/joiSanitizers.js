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
