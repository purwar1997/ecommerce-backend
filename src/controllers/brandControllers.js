import Brand from '../models/brand.js';
import handleAsync from '../services/handleAsync.js';
import { sendResponse } from '../utils/helpers.js';

export const getBrands = handleAsync(async (_req, res) => {
  const brands = await Brand.find();

  sendResponse(res, 200, 'Brands fetched successfully', brands);
});

export const addNewBrand = handleAsync(async (req, res) => {});

export const updateBrand = handleAsync(async (req, res) => {});
