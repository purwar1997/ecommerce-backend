import express from 'express';
import { signup, login, logout } from '../controllers/authControllers.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').post(authenticate, logout);

export default router;
