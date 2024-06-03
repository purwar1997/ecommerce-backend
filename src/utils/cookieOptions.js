export const setCookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

export const clearCookieOptions = {
  expires: new Date(),
};
