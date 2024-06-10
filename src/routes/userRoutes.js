import express from 'express';
import {
  getUserDetails,
  updateUser,
  deleteAccount,
  getUsers,
  getUserById,
  getAllAdmins,
} from '../controllers/userControllers.js';
import { updateUserSchema } from '../schemas/userSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import validateRole from '../middlewares/validateRole.js';
import validateSchema from '../middlewares/validateSchema.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router
  .route('/user')
  .get(authenticate, getUserDetails)
  .put(authenticate, validateSchema(updateUserSchema), updateUser)
  .delete(authenticate, deleteAccount);

router.route('/admin/users').get(authenticate, validateRole(ROLES.ADMIN), getUsers);
router.route('/admin/users/:userId').get(authenticate, validateRole(ROLES.ADMIN), getUserById);
router.route('/admin/admins').get(authenticate, validateRole(ROLES.ADMIN), getAllAdmins);

export default router;
