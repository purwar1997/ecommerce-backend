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
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { checkAdminSelfUpdate, checkAdminSelfDelete } from '../middlewares/checkAdmin.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router
  .route('/user')
  .get(isAuthenticated, getUserDetails)
  .put(isAuthenticated, validateSchema(updateUserSchema), updateProfile)
  .delete(isAuthenticated, deleteAccount);

router.route('/admin/users').get(isAuthenticated, authorizeRole(ROLES.ADMIN), getUsers);

router
  .route('/admin/users/:userId')
  .get(isAuthenticated, authorizeRole(ROLES.ADMIN), getUserById)
  .put(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    checkAdminSelfUpdate,
    validateSchema(updateRoleSchema),
    updateUserRole
  )
  .delete(isAuthenticated, authorizeRole(ROLES.ADMIN), checkAdminSelfDelete, deleteUser);

router.route('/admin/admins').get(isAuthenticated, authorizeRole(ROLES.ADMIN), getOtherAdmins);

router
  .route('/admin/self')
  .put(isAuthenticated, authorizeRole(ROLES.ADMIN), adminSelfDemote)
  .delete(isAuthenticated, authorizeRole(ROLES.ADMIN), adminSelfDelete);

export default router;
