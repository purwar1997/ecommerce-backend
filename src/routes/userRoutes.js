import express from 'express';
import { getUserDetails, getUserById } from '../controllers/userControllers.js';
import authenticate from '../middlewares/authenticate.js';
import validateRole from '../middlewares/validateRole.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router.route('/user').get(authenticate, getUserDetails);
router.route('/user/:userId').get(authenticate, validateRole(ROLES.ADMIN), getUserById);

export default router;
