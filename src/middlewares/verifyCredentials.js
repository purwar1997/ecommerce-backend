import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { verifyEmail, verifyPhone } from '../services/handleVerification.js';

export const isEmailValid = handleAsync(async (req, _res, next) => {
  const { emailToVerify, emailVerified } = await verifyEmail(req.body.email);

  if (!emailVerified) {
    throw new CustomError(
      `The email address ${emailToVerify} is not valid. Please provide a valid email address`,
      400
    );
  }

  next();
});

export const isPhoneValid = handleAsync(async (req, _res, next) => {
  const { phoneToVerify, phoneVerified } = await verifyPhone(req.body.phone);

  if (!phoneVerified) {
    throw new CustomError(
      `The phone number ${phoneToVerify} is not valid. Please provide a valid phone number`,
      400
    );
  }

  next();
});
