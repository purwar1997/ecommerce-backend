import express from 'express';
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authControllers.js';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/authSchemas.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { isEmailValid, isPhoneValid } from '../middlewares/verifyCredentials.js';

const router = express.Router();

router.route('/signup').post(validatePayload(signupSchema), isEmailValid, isPhoneValid, signup);
router.route('/login').post(validatePayload(loginSchema), login);
router.route('/logout').post(isAuthenticated, logout);
router.route('/password/forgot').post(validatePayload(forgotPasswordSchema), forgotPassword);
router.route('/password/reset/:token').put(validatePayload(resetPasswordSchema), resetPassword);

export default router;
