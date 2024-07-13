import express from 'express';
import {
  getProductReviews,
  addProductReview,
  getProductReviewById,
  updateProductReview,
} from '../controllers/reviewControllers.js';
import { reviewSchema } from '../schemas/reviewSchemas.js';
import { isAuthenticated,  } from '../middlewares/authMiddlewares.js';
import { validatePayload } from '../middlewares/requestValidators.js';

const router = express.Router();

router
  .route('/products/:productId/reviews')
  .get(getProductReviews)
  .post(isAuthenticated, validatePayload(reviewSchema), addProductReview);

router
  .get(isAuthenticated, getProductReviewById)
  .route('/reviews/:reviewId')
  .put(isAuthenticated, validatePayload(reviewSchema), updateProductReview);

export default router;
