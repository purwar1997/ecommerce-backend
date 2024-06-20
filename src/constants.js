export const DATABASE_NAME = 'Ecommerce';
export const JWT_EXPIRY = '24h';

export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
};

export const PAYMENT_METHODS = {
  COD: 'cash_on_delivery',
  DEBIT_CARD: 'debit_card',
  CREDIT_CARD: 'credit_card',
};

export const PRODUCTS_PER_PAGE = 15;
export const ORDERS_PER_PAGE = 5;
export const USERS_PER_PAGE = 5;
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
