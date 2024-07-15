import express from 'express';
import { createOrder } from '../controllers/orderControllers.js';
import { createOrderSchema } from '../schemas/orderSchemas.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import {
  validateProducts,
  validateCoupon,
  validateAddress,
} from '../middlewares/orderValidators.js';

const router = express.Router();

router
  .route('/orders')
  .all(isHttpMethodAllowed, isAuthenticated)
  .get()
  .post(
    validatePayload(createOrderSchema),
    validateProducts,
    validateCoupon,
    validateAddress,
    createOrder
  );

export default router;
