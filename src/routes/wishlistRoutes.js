import express from 'express';
import { getWishlist, addItemToWishlist } from '../controllers/wishlistControllers.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { productIdSchema } from '../schemas/wishlistSchemas.js';

const router = express.Router();

router.route('/wishlist').get(isAuthenticated, getWishlist);

router
  .route('/wishlist/add')
  .put(isAuthenticated, validatePayload(productIdSchema), addItemToWishlist);

export default router;
