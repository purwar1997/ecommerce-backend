import express from 'express';
import {
  getCategories,
  getCategoryById,
  addNewCategory,
  updateCategory,
} from '../controllers/categoryControllers.js';
import { categorySchema } from '../schemas/categorySchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { ROLES, UPLOAD_FOLDERS, UPLOADED_FILES } from '../constants.js';

const router = express.Router();

router.route('/categories').get(getCategories);
router.route('/categories/:categoryId').get(getCategoryById);

router
  .route('/admin/categories')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    parseFormData(UPLOAD_FOLDERS.CATEGORY_IMAGES, UPLOADED_FILES.CATEGORY_IMAGE),
    validateSchema(categorySchema),
    addNewCategory
  );

router
  .route('/admin/categories/:categoryId')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    parseFormData(UPLOAD_FOLDERS.CATEGORY_IMAGES, UPLOADED_FILES.CATEGORY_IMAGE),
    validateSchema(categorySchema),
    updateCategory
  );

export default router;
