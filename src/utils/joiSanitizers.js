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
