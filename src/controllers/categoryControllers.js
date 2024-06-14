import Category from '../models/category.js';
import handleAsync from '../services/handleAsync.js';
import { sendResponse } from '../utils/helpers.js';

export const getCategories = handleAsync(async (_req, res) => {
  const categories = await Category.find();

  sendResponse(res, 200, 'Categories fetched successfully', categories);
});

export const addNewCategory = handleAsync(async (req, res) => {});

export const updateCategory = handleAsync(async (req, res) => {});
