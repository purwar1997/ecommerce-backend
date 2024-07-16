import User from '../models/user.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const getCart = handleAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cart.product',
    match: {
      isDeleted: false,
    },
  });

  sendResponse(res, 200, 'Cart fetched successfully', user.cart);
});

export const addItemToCart = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const productExistsInCart = user.cart.find(cartItem => cartItem.product === productId);

  if (productExistsInCart) {
    productExistsInCart.quantity = productExistsInCart.quantity + 1;
    const index = user.cart.findIndex(cartItem => cartItem.product === productId);
    user.cart.splice(index, 1, productExistsInCart);
  } else {
    user.cart.push({ product: productId, quantity: 1 });
  }

  await user.save();

  sendResponse(res, 200, 'Item added to cart successfully', product);
});

export const removeItemFromCart = handleAsync(async (req, res) => {
  const { productId } = req.body;
  const { user } = req;

  const productExistsInCart = user.cart.find(cartItem => cartItem.product === productId);

  if (!productExistsInCart) {
    throw new CustomError('Item not found in cart', 404);
  }

  const index = user.cart.findIndex(cartItem => cartItem.product === productId);
  user.cart.splice(index, 1);

  await user.save();

  sendResponse(res, 200, 'Item removed from cart successfully', productId);
});