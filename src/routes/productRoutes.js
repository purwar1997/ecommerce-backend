import express from 'express';
import {
  getProducts,
  getProductById,
  adminGetProducts,
  addNewProduct,
  adminGetProductById,
} from '../controllers/productControllers.js';
import { productSchema, productIdSchema, productQuerySchema } from '../schemas/productSchemas.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import {
  validatePayload,
  validatePathParams,
  validateQueryParams,
} from '../middlewares/requestValidators.js';
import { ROLES, UPLOAD_FOLDERS, UPLOADED_FILES } from '../constants.js';

const router = express.Router();

router.route('/products').get(validateQueryParams(productQuerySchema), getProducts);
router.route('/products/:productId').get(validatePathParams(productIdSchema), getProductById);

router
  .route('/admin/products')
  .all(isHttpMethodAllowed, isAuthenticated, authorizeRole(ROLES.ADMIN))
  .get(validateQueryParams(productQuerySchema), adminGetProducts)
  .post(
    parseFormData(UPLOAD_FOLDERS.PRODUCT_IMAGES, UPLOADED_FILES.PRODUCT_IMAGE),
    validatePayload(productSchema),
    addNewProduct
  );

router
  .route('/admin/products/:productId')
  .all(
    isHttpMethodAllowed,
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePathParams(productIdSchema)
  )
  .get()
  .post(parseFormData, validatePayload(productSchema))
  .delete();

export default router;
