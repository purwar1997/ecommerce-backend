import express from 'express';
import {
  getCategories,
  addNewCategory,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryControllers.js';
import { categorySchema } from '../schemas/categorySchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router.route('/categories').get(getCategories);

router
  .route('/admin/categories')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    parseFormData,
    validateSchema(categorySchema),
    addNewCategory
  );

router
  .route('/admin/categories/:categoryId')
  .get(isAuthenticated, authorizeRole(ROLES.ADMIN), getCategoryById)
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    parseFormData,
    validateSchema(categorySchema),
    updateCategory
  );

export default router;
