import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const addNewProduct = handleAsync(async (req, res) => {
  const { title, brand, category } = req.body;

  const product = await Product.findOne({ title, brand, category });

  if (product) {
    throw new CustomError(
      'Product title must be unique within the same brand and category. Please provide a different product title',
      409
    );
  }

  const newProduct = await Product.create({ ...req.body, createdBy: req.user._id });

  sendResponse(res, 201, 'Product added successfully', newProduct);
});
