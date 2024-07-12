import mongoose from 'mongoose';
import Category from '../models/category.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';
import { uploadImage, deleteImage } from '../services/cloudinaryAPIs.js';
import { UPLOAD_FOLDERS } from '../constants.js';

export const getCategories = handleAsync(async (_req, res) => {
  const categories = await Category.find();

  sendResponse(res, 200, 'Categories fetched successfully', categories);
});

export const getCategoryById = handleAsync(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new CustomError('Category not found', 404);
  }

  sendResponse(res, 200, 'Category fetched by ID successfully', category);
});

export const addNewCategory = handleAsync(async (req, res) => {
  const { title } = req.body;

  const category = await Category.findOne({ title });

  if (category) {
    throw new CustomError(
      'Category by this title already exists. Please provide a different category title',
      409
    );
  }

  const categoryId = new mongoose.Types.ObjectId();

  const response = await uploadImage(UPLOAD_FOLDERS.CATEGORY_IMAGES, req.file, categoryId);

  const newCategory = await Category.create({
    _id: categoryId,
    title,
    image: {
      url: response.secure_url,
      publicId: response.public_id,
    },
    createdBy: req.user._id,
  });

  sendResponse(res, 201, 'Category added successfully', newCategory);
});

export const updateCategory = handleAsync(async (req, res) => {
  const { categoryId } = req.params;
  const { title } = req.body;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new CustomError('Category not found', 404);
  }

  const existingCategory = await Category.findOne({ title, _id: { $ne: categoryId } });

  if (existingCategory) {
    throw new CustomError(
      'Category by this title already exists. Please provide a different category title',
      409
    );
  }

  const response = await uploadImage(UPLOAD_FOLDERS.CATEGORY_IMAGES, req.file, categoryId);

  await deleteImage(category.image.publicId);

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      title,
      image: {
        url: response.secure_url,
        publicId: response.public_id,
      },
      lastUpdatedBy: req.user._id,
    },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'Category updated successfully', updatedCategory);
});
