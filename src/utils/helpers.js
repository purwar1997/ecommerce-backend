export const serialize = data => {
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
    data: serialize(data),
  });
};

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
