import {
  PRODUCT_SORT_OPTIONS,
  ADMIN_PRODUCT_SORT_OPTIONS,
  COUPON_SORT_OPTIONS,
  REVIEW_SORT_OPTIONS,
} from '../constants.js';

const { RECOMMENDED, NEWLY_ADDED, CUSTOMER_RATING, PRICE_LOW_TO_HIGH, PRICE_HIGH_TO_LOW } =
  PRODUCT_SORT_OPTIONS;

const { STOCK_LOW_TO_HIGH, STOCK_HIGH_TO_LOW } = ADMIN_PRODUCT_SORT_OPTIONS;
const { EXPIRY_ASC, EXPIRY_DESC } = COUPON_SORT_OPTIONS;
const { TOP_REVIEWS, MOST_RECENT } = REVIEW_SORT_OPTIONS;

export const productSortRules = {
  [RECOMMENDED]: { updatedAt: -1 },
  [NEWLY_ADDED]: { createdAt: -1 },
  [CUSTOMER_RATING]: { avgRating: -1 },
  [PRICE_LOW_TO_HIGH]: { price: 1 },
  [PRICE_HIGH_TO_LOW]: { price: -1 },
};

export const adminProductSortRules = {
  [NEWLY_ADDED]: { createdAt: -1 },
  [CUSTOMER_RATING]: { avgRating: -1 },
  [PRICE_LOW_TO_HIGH]: { price: 1 },
  [PRICE_HIGH_TO_LOW]: { price: -1 },
  [STOCK_LOW_TO_HIGH]: { stock: 1 },
  [STOCK_HIGH_TO_LOW]: { stock: -1 },
};

export const couponSortRules = {
  [EXPIRY_ASC]: { expiryDate: 1 },
  [EXPIRY_DESC]: { expiryDate: -1 },
};

export const reviewSortRules = {
  [TOP_REVIEWS]: { rating: -1 },
  [MOST_RECENT]: { updatedAt: -1 },
};
