import express from 'express';
import { signup, login, logout } from '../controllers/authControllers.js';
import { signupSchema, loginSchema } from '../schemas/authSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import validateSchema from '../middlewares/validateSchema.js';

const router = express.Router();

router.route('/signup').post(validateSchema(signupSchema), signup);
router.route('/login').post(validateSchema(loginSchema), login);
router.route('/logout').post(authenticate, logout);

export default router;
