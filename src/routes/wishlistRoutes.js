import express from 'express';
import { getWishlist } from '../controllers/wishlistControllers.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.route('/wishlist').get(isAuthenticated, getWishlist);

export default router;
