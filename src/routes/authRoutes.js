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
import { validateSchema } from '../middlewares/validateSchema.js';
import { isEmailValid, isPhoneValid } from '../middlewares/verifyCredentials.js';

const router = express.Router();

router.route('/signup').post(validateSchema(signupSchema), isEmailValid, isPhoneValid, signup);
router.route('/login').post(validateSchema(loginSchema), login);
router.route('/logout').post(isAuthenticated, logout);
router.route('/password/forgot').post(validateSchema(forgotPasswordSchema), forgotPassword);
router.route('/password/reset/:token').put(validateSchema(resetPasswordSchema), resetPassword);

export default router;
