import mongoose from 'mongoose';
import Product from '../models/product.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';
import { productSortRules, adminProductSortRules } from '../utils/sortRules.js';
import { deleteImage, uploadImage } from '../services/cloudinaryAPIs.js';
import { PAGINATION, UPLOAD_FOLDERS } from '../constants.js';

export const getProducts = handleAsync(async (req, res) => {
  const { categories, brands, rating, sort, page } = req.query;

  const filters = {};

  if (categories.length > 0) {
    const categoryList = await Category.find({ title: { $in: categories } });
    const categoryIDs = categoryList.map(category => category._id);
    filters.category = { $in: categoryIDs };
  }

  if (brands.length > 0) {
    const brandList = await Brand.find({ name: { $in: brands } });
    const brandIDs = brandList.map(brand => brand._id);
    filters.brand = { $in: brandIDs };
  }

  if (rating) {
    filters.avgRating = { $gte: rating };
  }

  const sortRule = productSortRules[sort];
  const offset = (page - 1) * PAGINATION.PRODUCTS_PER_PAGE;
  const limit = PAGINATION.PRODUCTS_PER_PAGE;

  const products = await Product.find({ ...filters, isDeleted: false })
    .sort(sortRule)
    .skip(offset)
    .limit(limit)
    .populate('brand', 'name')
    .populate('category', 'title');

  const productCount = await Product.countDocuments({ ...filters, isDeleted: false });

  res.set('X-Total-Count', productCount);

  sendResponse(res, 200, 'Products fetched successfully', products);
});

export const getProductById = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, isDeleted: false });

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  sendResponse(res, 200, 'Product fetched by ID successfully', product);
});

export const adminGetProducts = handleAsync(async (req, res) => {
  const { categories, brands, rating, availability, deleted, sort, page } = req.query;

  const filters = {};

  if (categories.length > 0) {
    const categoryList = await Category.find({ title: { $in: categories } });
    const categoryIDs = categoryList.map(category => category._id);
    filters.category = { $in: categoryIDs };
  }

  if (brands.length > 0) {
    const brandList = await Brand.find({ name: { $in: brands } });
    const brandIDs = brandList.map(brand => brand._id);
    filters.brand = { $in: brandIDs };
  }

  if (rating) {
    filters.avgRating = { $gte: rating };
  }

  if (typeof availability === 'boolean') {
    filters.stock = availability ? { $gt: 0 } : 0;
  }

  if (typeof deleted === 'boolean') {
    filters.isDeleted = deleted;
  }

  const sortRule = adminProductSortRules[sort];
  const offset = (page - 1) * PAGINATION.PRODUCTS_PER_PAGE;
  const limit = PAGINATION.PRODUCTS_PER_PAGE;

  const products = await Product.find(filters)
    .sort(sortRule)
    .skip(offset)
    .limit(limit)
    .populate('brand', 'name')
    .populate('category', 'title');

  const productCount = await Product.countDocuments(filters);

  res.set('X-Total-Count', productCount);

  sendResponse(res, 200, 'Products fetched successfully', products);
});

export const addNewProduct = handleAsync(async (req, res) => {
  const { title, brand, category } = req.body;

  const existingProduct = await Product.findOne({ title, brand, category });

  if (existingProduct) {
    throw new CustomError(
      'Product title must be unique within the same brand and category. To proceed, please change either the product title, category or brand',
      409
    );
  }

  const productId = new mongoose.Types.ObjectId();

  const response = await uploadImage(UPLOAD_FOLDERS.PRODUCT_IMAGES, req.file, productId);

  const newProduct = await Product.create({
    _id: productId,
    ...req.body,
    image: {
      url: response.secure_url,
      publicId: response.public_id,
    },
    createdBy: req.user._id,
  });

  sendResponse(res, 201, 'Product added successfully', newProduct);
});

export const adminGetProductById = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  sendResponse(res, 200, 'Product fetched by ID successfully', product);
});

export const updateProduct = handleAsync(async (req, res) => {
  const { productId } = req.params;
  const { title, brand, category } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError('Product not found', 404);
  }

  const existingProduct = await Product.findOne({
    title,
    brand,
    category,
    _id: { $ne: productId },
  });

  if (existingProduct) {
    throw new CustomError(
      'Product title must be unique within the same brand and category. To proceed, please change either the product title, category or brand',
      409
    );
  }

  await deleteImage(product.image.publicId);

  const response = await uploadImage(UPLOAD_FOLDERS.PRODUCT_IMAGES, req.file, productId);

  const updatedProduct = await Product.findByIdAndUpdate(productId, {
    ...req.body,
    image: {
      url: response.secure_url,
      publicId: response.public_id,
    },
    lastUpdatedBy: req.user._id,
  });

  sendResponse(res, 200, 'Product updated successfully', updatedProduct);
});

export const deleteProduct = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const deletedProduct = await Product.findOneAndUpdate(
    { _id: productId, isDeleted: false },
    {
      isDeleted: true,
      deletedBy: req.user._id,
      deletedAt: new Date(),
    },
    { runValidators: true }
  );

  if (!deletedProduct) {
    throw new CustomError('Product not found', 404);
  }

  sendResponse(res, 200, 'Product deleted successfully');
});

export const restoreDeletedProduct = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const restoredProduct = await Product.findByIdAndUpdate(
    productId,
    {
      isDeleted: false,
      $unset: { deletedBy: 1, deletedAt: 1 },
    },
    { runValidators: true, new: true }
  );

  if (!restoredProduct) {
    throw new CustomError('Product not found', 404);
  }

  sendResponse(res, 200, 'Product restored successfully', restoredProduct);
});