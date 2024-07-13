import express from 'express';
import { addNewProduct } from '../controllers/productControllers.js';
import { productSchema } from '../schemas/productSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { parseFormData } from '../middlewares/parseFormData.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router.route('/products').get();
router.route('/products/:productId').get();

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
  .post(isAuthenticated, authorizeRole(ROLES.ADMIN), parseFormData, validatePayload(productSchema))
  .delete(isAuthenticated, authorizeRole(ROLES.ADMIN));

export default router;
