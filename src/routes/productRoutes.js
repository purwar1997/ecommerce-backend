import express from 'express';
import { addNewProduct } from '../controllers/productControllers.js';
import { productSchema, productIdSchema, getProductsSchema } from '../schemas/productSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import {
  validatePayload,
  validatePathParams,
  validateQueryParams,
} from '../middlewares/requestValidators.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router.route('/products').get(validateQueryParams(getProductsSchema));
router.route('/products/:productId').get(validatePathParams(productIdSchema));

router
  .route('/admin/products')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    parseFormData,
    validatePayload(productSchema),
    addNewProduct
  );

router
  .route('/admin/products/:productId')
  .post(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePathParams(productIdSchema),
    parseFormData,
    validatePayload(productSchema)
  )
  .delete(isAuthenticated, authorizeRole(ROLES.ADMIN), validatePathParams(productIdSchema));

export default router;
