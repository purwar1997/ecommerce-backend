import express from 'express';
import {
  getBrands,
  getBrandById,
  addNewBrand,
  updateBrand,
} from '../controllers/brandControllers.js';
import { brandSchema } from '../schemas/brandSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { ROLES, UPLOAD_FOLDERS, UPLOADED_FILES } from '../constants.js';

const router = express.Router();

router.route('/brands').get(getBrands);
router.route('/brands/:brandId').get(getBrandById);

router
  .route('/admin/brands')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    parseFormData(UPLOAD_FOLDERS.BRAND_LOGOS, UPLOADED_FILES.BRAND_LOGO),
    validatePayload(brandSchema),
    addNewBrand
  );

router
  .route('/admin/brands/:brandId')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    parseFormData(UPLOAD_FOLDERS.BRAND_LOGOS, UPLOADED_FILES.BRAND_LOGO),
    validatePayload(brandSchema),
    updateBrand
  );

export default router;
