import express from 'express';
import {
  getUserDetails,
  updateProfile,
  deleteAccount,
  addProfilePhoto,
  updateProfilePhoto,
  removeProfilePhoto,
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
import { isPhoneValid } from '../middlewares/verifyCredentials.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { checkAdminSelfUpdate, checkAdminSelfDelete } from '../middlewares/checkAdmin.js';
import { ROLES, UPLOAD_FOLDERS, UPLOADED_FILES } from '../constants.js';

const router = express.Router();

router
  .route('/user')
  .get(isAuthenticated, getUserDetails)
  .put(isAuthenticated, validateSchema(updateUserSchema), isPhoneValid, updateProfile)
  .delete(isAuthenticated, deleteAccount);

router
  .route('/users/self/avatar')
  .post(
    isAuthenticated,
    parseFormData(UPLOAD_FOLDERS.USER_AVATARS, UPLOADED_FILES.USER_AVATAR),
    addProfilePhoto
  )
  .delete(isAuthenticated, removeProfilePhoto);

router
  .route('/users/self/avatar/update')
  .post(
    isAuthenticated,
    parseFormData(UPLOAD_FOLDERS.USER_AVATARS, UPLOADED_FILES.USER_AVATAR),
    updateProfilePhoto
  );

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
