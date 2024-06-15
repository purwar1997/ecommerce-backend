import Brand from '../models/brand.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const getBrands = handleAsync(async (_req, res) => {
  const brands = await Brand.find();

  sendResponse(res, 200, 'Brands fetched successfully', brands);
});

export const addNewBrand = handleAsync(async (req, res) => {});

export const getBrandById = handleAsync(async (req, res) => {
  const { brandId } = req.params;

  const brand = await Brand.findById(brandId);

  if (!brand) {
    throw new CustomError('Brand not found', 404);
  }

  sendResponse(res, 200, 'Brand fetched by ID successfully', brand);
});

export const updateBrand = handleAsync(async (req, res) => {});
