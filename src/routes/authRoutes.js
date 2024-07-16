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

router
  .route('/auth/signup')
  .post(validatePayload(signupSchema), isEmailValid, isPhoneValid, signup);

router.route('/auth/login').post(validatePayload(loginSchema), login);
router.route('/auth/logout').post(isAuthenticated, logout);
router.route('/auth/password/forgot').post(validatePayload(forgotPasswordSchema), forgotPassword);

router
  .route('/auth/password/reset/:token')
  .put(validatePayload(resetPasswordSchema), resetPassword);

export default router;
