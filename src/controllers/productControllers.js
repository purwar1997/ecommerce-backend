import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const addNewProduct = handleAsync(async (req, res) => {
  const newProduct = await Product.create({ ...req.body, createdBy: req.user._id });

  sendResponse(res, 201, 'Product added successfully', newProduct);
});
