import User from '../models/user.js';
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

export const addToCart = handleAsync(async (req, res) => {});

export const addItemToCart = handleAsync((req, res) => {});
