import express from 'express';
import {
  getProductReviews,
  addReview,
  updateReview,
  getReviewById,
} from '../controllers/reviewControllers.js';
import { addReviewSchema, updateReviewSchema } from '../schemas/reviewSchema.js';
import authenticate from '../middlewares/authenticate.js';
import validateSchema from '../middlewares/validateSchema.js';

const router = express.Router();

router.route('/products/:productId/reviews').get(getProductReviews);

router.route('/reviews').post(authenticate, validateSchema(addReviewSchema), addReview);

router
  .route('/reviews/:reviewId')
  .get(authenticate, getReviewById)
  .put(authenticate, validateSchema(updateReviewSchema), updateReview);

export default router;
