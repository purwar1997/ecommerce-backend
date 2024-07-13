import express from 'express';
import {
  getProfile,
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
import {
  userIdSchema,
  updateUserSchema,
  updateRoleSchema,
  getUsersSchema,
} from '../schemas/userSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import {
  validatePayload,
  validateQueryParams,
  validatePathParams,
} from '../middlewares/requestValidators.js';
import { isPhoneValid } from '../middlewares/verifyCredentials.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { checkAdminSelfUpdate, checkAdminSelfDelete } from '../middlewares/checkAdmin.js';
import { ROLES, UPLOAD_FOLDERS, UPLOADED_FILES } from '../constants.js';

const router = express.Router();

router
  .route('/users/self')
  .get(isAuthenticated, getProfile)
  .put(isAuthenticated, validatePayload(updateUserSchema), isPhoneValid, updateProfile)
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

router
  .route('/admin/users')
  .get(isAuthenticated, authorizeRole(ROLES.ADMIN), validateQueryParams(getUsersSchema), getUsers);

router
  .route('/admin/users/:userId')
  .get(isAuthenticated, authorizeRole(ROLES.ADMIN), validatePathParams(userIdSchema), getUserById)
  .put(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    checkAdminSelfUpdate,
    validatePathParams(userIdSchema),
    validatePayload(updateRoleSchema),
    updateUserRole
  )
  .delete(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    checkAdminSelfDelete,
    validatePathParams(userIdSchema),
    deleteUser
  );

router.route('/admin/admins').get(isAuthenticated, authorizeRole(ROLES.ADMIN), getOtherAdmins);

router
  .route('/admin/self')
  .put(isAuthenticated, authorizeRole(ROLES.ADMIN), adminSelfDemote)
  .delete(isAuthenticated, authorizeRole(ROLES.ADMIN), adminSelfDelete);

export default router;
