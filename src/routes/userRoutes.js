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
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';
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
  .all(isHttpMethodAllowed, isAuthenticated)
  .get(getProfile)
  .put(validatePayload(updateUserSchema), isPhoneValid, updateProfile)
  .delete(deleteAccount);

router
  .route('/users/self/avatar')
  .all(isHttpMethodAllowed, isAuthenticated)
  .post(parseFormData(UPLOAD_FOLDERS.USER_AVATARS, UPLOADED_FILES.USER_AVATAR), addProfilePhoto)
  .delete(removeProfilePhoto);

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
  .all(isHttpMethodAllowed, isAuthenticated, authorizeRole(ROLES.ADMIN))
  .get(validatePathParams(userIdSchema), getUserById)
  .put(
    checkAdminSelfUpdate,
    validatePathParams(userIdSchema),
    validatePayload(updateRoleSchema),
    updateUserRole
  )
  .delete(checkAdminSelfDelete, validatePathParams(userIdSchema), deleteUser);

router.route('/admin/admins').get(isAuthenticated, authorizeRole(ROLES.ADMIN), getOtherAdmins);

router
  .route('/admin/self')
  .all(isHttpMethodAllowed, isAuthenticated, authorizeRole(ROLES.ADMIN))
  .put(adminSelfDemote)
  .delete(adminSelfDelete);

export default router;
