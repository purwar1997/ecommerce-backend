import express from 'express';
import { getUserDetails } from '../controllers/userControllers.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.route('/user').get(authenticate, getUserDetails);

export default router;
