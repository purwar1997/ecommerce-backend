import express from 'express';
import {
  getBrands,
  addNewBrand,
  getBrandById,
  updateBrand,
} from '../controllers/brandControllers.js';
import { brandSchema } from '../schemas/brandSchema.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router.route('/brands').get(getBrands);

router
  .route('/admin/brands')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    parseFormData,
    validateSchema(brandSchema),
    addNewBrand
  );

router
  .route('/admin/brands/:brandId')
  .get(isAuthenticated, authorizeRole(ROLES.ADMIN), getBrandById)
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    parseFormData,
    validateSchema(brandSchema),
    updateBrand
  );

export default router;
