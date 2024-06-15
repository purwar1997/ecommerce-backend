import express from 'express';
import {
  getProductReviews,
  addProductReview,
  getProductReviewById,
  updateProductReview,
} from '../controllers/reviewControllers.js';
import { reviewSchema } from '../schemas/reviewSchema.js';
import authenticate from '../middlewares/authenticate.js';
import validateSchema from '../middlewares/validateSchema.js';

const router = express.Router();

router
  .route('/products/:productId/reviews')
  .get(getProductReviews)
  .post(authenticate, validateSchema(reviewSchema), addProductReview);

router
  .get(authenticate, getProductReviewById)
  .route('/reviews/:reviewId')
  .put(authenticate, validateSchema(reviewSchema), updateProductReview);

export default router;
