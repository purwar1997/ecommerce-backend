import { PRODUCT_SORT_OPTIONS } from '../constants.js';

const { RECOMMENDED, RATING, PRICE_LOW_TO_HIGH, PRICE_HIGH_TO_LOW, NEWLY_ADDED } =
  PRODUCT_SORT_OPTIONS;

export const productSortRules = {
  [RECOMMENDED]: { updatedAt: -1 },
  [RATING]: { avgRating: -1 },
  [PRICE_LOW_TO_HIGH]: { price: 1 },
  [PRICE_HIGH_TO_LOW]: { price: -1 },
  [NEWLY_ADDED]: { createdAt: -1 },
};
