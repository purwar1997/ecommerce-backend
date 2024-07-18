export const STORAGE = Object.freeze({
  DATABASE_NAME: 'shopease_db',
  CLOUD_NAME: 'dlqnx5pot',
});

export const JWT = Object.freeze({
  EXPIRY: '24h',
});

export const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
});

export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
});

export const PAYMENT_METHODS = Object.freeze({
  COD: 'cash_on_delivery',
  DEBIT_CARD: 'debit_card',
  CREDIT_CARD: 'credit_card',
});

export const DISCOUNT_TYPES = Object.freeze({
  PERCENTAGE: 'percentage',
  FLAT: 'flat',
});

export const COUPON_STATES = Object.freeze({
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
});

export const UPLOAD_FOLDERS = Object.freeze({
  USER_AVATARS: 'user_avatars',
  CATEGORY_IMAGES: 'category_images',
  BRAND_LOGOS: 'brand_logos',
  PRODUCT_IMAGES: 'product_images',
});

export const UPLOAD_FILES = Object.freeze({
  USER_AVATAR: 'avatar',
  CATEGORY_IMAGE: 'image',
  BRAND_LOGO: 'logo',
  PRODUCT_IMAGE: 'image',
});

export const PAGINATION = Object.freeze({
  PRODUCTS_PER_PAGE: 15,
  ORDERS_PER_PAGE: 5,
  USERS_PER_PAGE: 5,
  COUPONS_PER_PAGE: 5,
  REVIEWS_PER_PAGE: 5,
});

export const PRICE = Object.freeze({
  MIN: 10,
  MAX: 100000,
});

export const STOCK = Object.freeze({
  MIN: 1,
  MAX: 10000,
});

export const QUANTITY = Object.freeze({
  MIN: 1,
  MAX: 10,
});

export const RATING = Object.freeze({
  MIN: 1,
  MAX: 5,
});

export const SHIPPING_CHARGE = Object.freeze({
  MIN: 30,
});

export const GST = Object.freeze({
  RATE: 0.18,
});

export const DISCOUNT = Object.freeze({
  MIN_FLAT: 10,
  MAX_FLAT: 1000,
  FLAT_MULTIPLE: 10,
  MIN_PERCENTAGE: 1,
  MAX_PERCENTAGE: 100,
});

export const FILE_UPLOAD = Object.freeze({
  MAX_FILES: 1,
  MAX_FILE_SIZE: 20 * 1024 * 1024,
});

export const SAFE_INTEGER = Object.freeze({
  MIN: Number.MIN_SAFE_INTEGER,
  MAX: Number.MAX_SAFE_INTEGER,
});

export const PRODUCT_SORT_OPTIONS = Object.freeze({
  RECOMMENDED: 'recommended',
  RATING: 'rating',
  PRICE_LOW_TO_HIGH: 'price_asc',
  PRICE_HIGH_TO_LOW: 'price_desc',
  NEWLY_ADDED: 'new',
});

export const COUPON_SORT_OPTIONS = Object.freeze({
  EXPIRY_ASC: 'expiry_asc',
  EXPIRY_DESC: 'expiry_desc',
});

export const REVIEW_SORT_OPTIONS = Object.freeze({
  TOP_REVIEWS: 'top',
  MOST_RECENT: 'recent',
});