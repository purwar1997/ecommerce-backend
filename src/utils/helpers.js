export const serializeDocs = docs => docs.map(doc => doc.toObject());

export const stripConfirmPassword = (value, _helpers) => {
  const { confirmPassword, ...rest } = value;
  return rest;
};

export const stripEmptyKeys = obj => {
  for (const key in obj) {
    if (obj[key] === '') {
      delete obj[key];
    }
  }

  return obj;
};
