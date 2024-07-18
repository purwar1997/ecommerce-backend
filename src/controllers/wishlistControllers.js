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

export const addItemToWishlist = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const productExistsInWishlist = user.wishlist.includes(productId);

  if (productExistsInWishlist) {
    throw new CustomError('Item already exists in wishlist', 409);
  }

  user.wishlist.push(productId);
  await user.save();

  sendResponse(res, 200, 'Item added to wishlist successfully', product);
});

export const removeItemFromWishlist = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const productExistsInWishlist = user.wishlist.includes(productId);

  if (!productExistsInWishlist) {
    throw new CustomError('Item not found in wishlist', 409);
  }

  user.wishlist = user.wishlist.filter(item => item !== productId);
  await user.save();

  sendResponse(res, 200, 'Item removed from wishlist successfully', productId);
});