import Product from '../models/product.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';
import { productSortRules } from '../utils/sortRules.js';
import { PAGINATION } from '../constants.js';

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

export const getProductById = handleAsync(async (req, res) => {});

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
