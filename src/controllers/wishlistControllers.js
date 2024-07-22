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

  const wishlistItem = user.wishlist.find(wishlistItem.toString() === productId);

  if (wishlistItem) {
    throw new CustomError('Item already exists in wishlist', 409);
  }

  user.wishlist.push(productId);
  await user.save();

  sendResponse(res, 200, 'Item added to wishlist successfully', product);
});

export const removeItemFromWishlist = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const wishlistItem = user.wishlist.find(wishlistItem.toString() === productId);

  if (!wishlistItem) {
    throw new CustomError('Item not found in wishlist', 404);
  }

  user.wishlist = user.wishlist.filter(wishlistItem => wishlistItem.toString() !== productId);
  await user.save();

  sendResponse(res, 200, 'Item removed from wishlist successfully', productId);
});

export const moveItemToCart = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const wishlistItem = user.wishlist.find(wishlistItem.toString() === productId);

  if (!wishlistItem) {
    throw new CustomError('Item not found in wishlist', 404);
  }

  if (product.stock === 0) {
    throw new CustomError('Item is out of stock and cannot be moved to the cart', 403);
  }

  user.wishlist = user.wishlist.filter(wishlistItem => wishlistItem.toString() !== productId);
  const cartItem = user.cart.find(cartItem => cartItem.product.toString() === productId);

  if (!cartItem) {
    user.cart.push({ product: productId, quantity: 1 });
  }

  await user.save();

  sendResponse(res, 200, 'Item moved from wishlist to cart successfully', product);
});

export const clearWishlist = handleAsync(async (req, res) => {
  const { user } = req;

  user.wishlist = [];
  await user.save();

  sendResponse(res, 200, 'Wishlist cleared successfully');
});