export const expectedHttpActions = {
  '/signup': ['POST'],
  '/login': ['POST'],
  '/logout': ['POST'],
  '/password/forgot': ['POST'],
  '/password/reset/:token': ['PUT'],
  '/users/self': ['GET', 'PUT', 'DELETE'],
  '/users/self/avatar': ['POST', 'DELETE'],
  '/users/self/avatar/update': ['POST'],
  '/admin/users': ['GET'],
  '/admin/users/:userId': ['GET', 'PUT', 'DELETE'],
  '/admin/admins': ['GET'],
  '/admin/self': ['PUT', 'DELETE'],
  '/addresses': ['GET', 'POST'],
  '/addresses/:addressId': ['GET', 'PUT', 'DELETE'],
  '/addresses/:addressId/default': ['PUT'],
  '/categories': ['GET'],
  '/categories/:categoryId': ['GET'],
  '/admin/categories': ['POST'],
  '/admin/categories/:categoryId': ['POST'],
  '/brands': ['GET'],
  '/brands/:brandId': ['GET'],
  '/admin/brands': ['POST'],
  '/admin/brands/:brandId': ['POST'],

  '/products': ['GET'],
  '/products/:productId': ['GET'],
  '/admin/products': ['GET', 'POST'],
  '/admin/products/:productId': ['GET', 'POST', 'DELETE'],

  '/coupons': ['GET'],
  '/coupons/validity': ['GET'],
  '/admin/coupons': ['GET', 'POST'],
  '/admin/coupons/:couponId': ['GET', 'PUT', 'DELETE'],
  '/admin/coupons/:couponId/state': ['PATCH'],

  '/orders': ['GET', 'POST'],

  '/products/:productId/reviews': ['GET', 'POST'],
  '/reviews/:reviewId': ['GET', 'PUT'],
};
