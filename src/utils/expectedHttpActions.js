export const expectedHttpActions = {
  '/users/self': ['GET', 'PUT', 'DELETE'],
  '/users/self/avatar': ['POST', 'PUT'],
  '/admin/users/:userId': ['GET', 'PUT', 'DELETE'],
  '/admin/self': ['PUT', 'DELETE'],
  '/addresses': ['GET', 'POST'],
  '/addresses/:addressId': ['GET', 'PUT', 'DELETE'],
  '/admin/products': ['GET', 'POST'],
  '/admin/products/:productId': ['GET', 'POST', 'DELETE'],
  '/admin/coupons': ['GET', 'POST'],
  '/admin/coupons/:couponId': ['GET', 'PUT', 'DELETE'],
  '/orders': ['GET', 'POST'],
  '/reviews/:reviewId': ['GET', 'PUT'],
};
