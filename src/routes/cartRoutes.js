import express from 'express';
import { getCart, addItemToCart } from '../controllers/cartControllers.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { productIdSchema } from '../schemas/cartSchemas.js';

const router = express.Router();

router.route('/cart').get(isAuthenticated, getCart);
router.route('/cart/add').post(isAuthenticated, validatePayload(productIdSchema), addItemToCart);

export default router;
