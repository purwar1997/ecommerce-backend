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
