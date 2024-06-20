import Review from '../models/review.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const getProductReviews = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const reviews = await Review.find({ product: productId });

  sendResponse(res, 200, 'Reviews fetched successfully', reviews);
});

export const addProductReview = handleAsync(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const order = await Order.findOne({
    user: userId,
    items: {
      $elemMatch: { product: productId },
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

  const addedReview = await Review.create({ ...req.body, product: productId, user: userId });

  const product = await Product.findById(productId);

  product.avgRating =
    (product.avgRating * product.reviewCount + req.body.rating) / (product.reviewCount + 1);

  product.reviewCount = product.reviewCount + 1;

  await product.save();

  sendResponse(res, 201, 'Review added successfully', addedReview);
});

export const getProductReviewById = handleAsync(async (req, res) => {
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

export const updateProductReview = handleAsync(async (req, res) => {
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

  const product = await Product.findById(updatedReview.product);

  product.avgRating =
    (product.avgRating * product.reviewCount - review.rating + updates.rating) /
    product.reviewCount;

  await product.save();

  sendResponse(res, 200, 'Review updated successfully', updatedReview);
});
