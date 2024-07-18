import User from '../models/user.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const getWishlist = handleAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    match: {
      isDeleted: false,
    },
  });

  sendResponse(res, 200, 'Wishlist fetched successfully', user.wishlist);
});
