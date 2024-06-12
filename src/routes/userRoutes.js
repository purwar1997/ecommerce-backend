import express from 'express';
import {
  getUserDetails,
  updateProfile,
  deleteAccount,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getOtherAdmins,
  adminSelfDemote,
  adminSelfDelete,
} from '../controllers/userControllers.js';
import { updateUserSchema, updateRoleSchema } from '../schemas/userSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import validateRole from '../middlewares/validateRole.js';
import validateSchema from '../middlewares/validateSchema.js';
import checkAdminSelfUpdate from '../middlewares/checkAdminSelfUpdate.js';
import checkAdminSelfDelete from '../middlewares/checkAdminSelfDelete.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router
  .route('/user')
  .get(authenticate, getUserDetails)
  .put(authenticate, validateSchema(updateUserSchema), updateProfile)
  .delete(authenticate, deleteAccount);

router.route('/admin/users').get(authenticate, validateRole(ROLES.ADMIN), getUsers);

router
  .route('/admin/users/:userId')
  .get(authenticate, validateRole(ROLES.ADMIN), getUserById)
  .put(
    authenticate,
    validateRole(ROLES.ADMIN),
    checkAdminSelfUpdate,
    validateSchema(updateRoleSchema),
    updateUserRole
  )
  .delete(authenticate, validateRole(ROLES.ADMIN), checkAdminSelfDelete, deleteUser);

router.route('/admin/admins').get(authenticate, validateRole(ROLES.ADMIN), getOtherAdmins);

router
  .route('/admin/self')
  .put(authenticate, validateRole(ROLES.ADMIN), adminSelfDemote)
  .delete(authenticate, validateRole(ROLES.ADMIN), adminSelfDelete);

export default router;
