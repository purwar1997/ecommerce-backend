import express from 'express';
import { createOrder, getOrders } from '../controllers/orderControllers.js';
import { createOrderSchema, ordersQuerySchema } from '../schemas/orderSchemas.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { validatePayload, validateQueryParams } from '../middlewares/requestValidators.js';
import {
  validateProducts,
  validateCoupon,
  validateAddress,
} from '../middlewares/orderValidators.js';

const router = express.Router();

router
  .route('/orders')
  .all(isHttpMethodAllowed, isAuthenticated)
  .get(validateQueryParams(ordersQuerySchema), getOrders)
  .post(
    validatePayload(createOrderSchema),
    validateProducts,
    validateCoupon,
    validateAddress,
    createOrder
  );

export default router;
