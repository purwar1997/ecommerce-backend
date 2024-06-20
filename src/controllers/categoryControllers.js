import Category from '../models/category.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const getCategories = handleAsync(async (_req, res) => {
  const categories = await Category.find();

  sendResponse(res, 200, 'Categories fetched successfully', categories);
});

export const addNewCategory = handleAsync(async (req, res) => {});

export const getCategoryById = handleAsync(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new CustomError('Category not found', 404);
  }

  sendResponse(res, 200, 'Category fetched by ID successfully', category);
});

export const updateCategory = handleAsync(async (req, res) => {});
