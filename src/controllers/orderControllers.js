import Order from '../models/order.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const createOrder = handleAsync(async (req, res) => {
  const newOrder = await Order.create({ ...req.body, user: req.user._id });

  sendResponse(res, 201, 'Order created successfully', newOrder);
});
