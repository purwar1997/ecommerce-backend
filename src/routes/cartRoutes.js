import express from 'express';
import { getCart, addItemToCart } from '../controllers/cartControllers.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';

const router = express.Router();

router
  .route('/cart')
  .all(isHttpMethodAllowed, isAuthenticated)
  .get(getCart)
  .post(validatePayload());

export default router;
