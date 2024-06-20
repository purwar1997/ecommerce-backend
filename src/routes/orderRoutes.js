import express from 'express';
import { createOrder } from '../controllers/orderControllers.js';
import { createOrderSchema } from '../schemas/orderSchema.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  validateProducts,
  validateCoupon,
  validateAddress,
} from '../middlewares/orderValidation.js';

const router = express.Router();

router
  .route('/orders')
  .post(
    isAuthenticated,
    validateSchema(createOrderSchema),
    validateProducts,
    validateCoupon,
    validateAddress,
    createOrder
  );

export default router;
