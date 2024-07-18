import express from 'express';
import {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
} from '../controllers/wishlistControllers.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';
import { productIdSchema } from '../schemas/wishlistSchemas.js';

const router = express.Router();

router.route('/wishlist').get(isAuthenticated, getWishlist);

router
  .route('/wishlist/add')
  .put(isAuthenticated, validatePayload(productIdSchema), addItemToWishlist);

router
  .route('/wishlist/remove')
  .put(isAuthenticated, validatePayload(productIdSchema), removeItemFromWishlist);

export default router;
