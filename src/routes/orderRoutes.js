import express from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orderControllers.js';
import { createOrderSchema, ordersQuerySchema, orderIdSchema } from '../schemas/orderSchemas.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import {
  validatePayload,
  validateQueryParams,
  validatePathParams,
} from '../middlewares/requestValidators.js';
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

router.route('/orders/:orderId').get(validatePathParams(orderIdSchema), getOrderById);

export default router;
