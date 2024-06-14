import express from 'express';
import { getBrands, addNewBrand, updateBrand } from '../controllers/brandControllers.js';
import authenticate from '../middlewares/authenticate.js';
import validateRole from '../middlewares/validateRole.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router.route('/brands').get(getBrands).post(authenticate, validateRole(ROLES.ADMIN), addNewBrand);

router.route('/brands/:brandId').put(authenticate, validateRole(ROLES.ADMIN), updateBrand);

export default router;
