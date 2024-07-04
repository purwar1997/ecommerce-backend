export const DATABASE_NAME = 'ecommerce_db';
export const JWT_EXPIRY = '24h';

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

export const PRODUCTS_PER_PAGE = 15;
export const ORDERS_PER_PAGE = 5;
export const USERS_PER_PAGE = 5;
export const COUPONS_PER_PAGE = 5;
export const MIN_PRICE = 10;
export const MAX_PRICE = 100000;
export const MIN_STOCK = 1;
export const MAX_STOCK = 10000;
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 10;
export const MIN_SHIPPING_CHARGE = 30;
export const GST_RATE = 0.18;
export const MIN_RATING = 1;
export const MAX_RATING = 5;
export const MIN_FLAT_DISCOUNT = 10;
export const MAX_FLAT_DISCOUNT = 1000;
export const FLAT_DISCOUNT_MULTIPLE = 10;
export const MIN_PERCENTAGE_DISCOUNT = 1;
export const MAX_PERCENTAGE_DISCOUNT = 100;

