import Review from '../models/review.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const getProductReviews = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, deleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const reviews = await Review.find({ product: productId });

  sendResponse(res, 200, 'Product reviews fetched successfully', reviews);
});

export const addReview = handleAsync(async (req, res) => {
  const review = req.body;
  const userId = req.user._id;

  const order = await Order.findOne({
    user: userId,
    items: {
      $elemMatch: { product: review.product },
    },
  });

  if (!order) {
    throw new CustomError('Only the user who has bought this product can add a review', 403);
  }

  if (order.status !== 'delivered') {
    throw new CustomError(
      'Reviews for products can only be submitted after the order has been delivered',
      403
    );
  }

  const addedReview = await Review.create({ ...review, user: userId });

  sendResponse(res, 201, 'Review added successfully', addedReview);
});

export const getReviewById = handleAsync(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError('Review not found', 404);
  }

  if (review.user !== req.user._id) {
    throw new CustomError('Only the user who has added this review can view it', 403);
  }

  sendResponse(res, 200, 'Review fetched by ID successfully', review);
});

export const updateReview = handleAsync(async (req, res) => {
  const { reviewId } = req.params;
  const updates = req.body;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError('Review not found', 404);
  }

  if (review.user !== req.user._id) {
    throw new CustomError('Only the user who has added this review can update it', 403);
  }

  const updatedReview = await Review.findByIdAndUpdate(reviewId, updates, {
    runValidators: true,
    new: true,
  });

  sendResponse(res, 200, 'Review updated successfully', updatedReview);
});
