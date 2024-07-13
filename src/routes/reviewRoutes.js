import express from 'express';
import {
  getProductReviews,
  addProductReview,
  getProductReviewById,
  updateProductReview,
} from '../controllers/reviewControllers.js';
import { reviewSchema, reviewIdSchema } from '../schemas/reviewSchemas.js';
import { productIdSchema } from '../schemas/productSchemas.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload, validatePathParams } from '../middlewares/requestValidators.js';

const router = express.Router();

router
  .route('/products/:productId/reviews')
  .get(validatePathParams(productIdSchema), getProductReviews)
  .post(
    isAuthenticated,
    validatePathParams(productIdSchema),
    validatePayload(reviewSchema),
    addProductReview
  );

router
  .route('/reviews/:reviewId')
  .get(isAuthenticated, validatePathParams(reviewIdSchema), getProductReviewById)
  .put(
    isAuthenticated,
    validatePathParams(reviewIdSchema),
    validatePayload(reviewSchema),
    updateProductReview
  );

export default router;
