import express from 'express';
import { getUserDetails, getUserById } from '../controllers/userControllers.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.route('/user').get(authenticate, getUserDetails);
router.route('/user/:userId').get(getUserById);

export default router;
