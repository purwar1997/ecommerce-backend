import express from 'express';
import {
  getCategories,
  addNewCategory,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryControllers.js';
import authenticate from '../middlewares/authenticate.js';
import validateRole from '../middlewares/validateRole.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router
  .route('/categories')
  .get(getCategories)
  .post(authenticate, validateRole(ROLES.ADMIN), addNewCategory);

router
  .route('/categories/:categoryId')
  .get(authenticate, validateRole(ROLES.ADMIN), getCategoryById)
  .post(authenticate, validateRole(ROLES.ADMIN), updateCategory);

export default router;
