import express from 'express';
import {
  getAddresses,
  addNewAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressControllers.js';
import { addressSchema } from '../schemas/addressSchemas.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { isPhoneValid } from '../middlewares/verifyCredentials.js';

const router = express.Router();

router
  .route('/addresses')
  .get(isAuthenticated, getAddresses)
  .post(isAuthenticated, validateSchema(addressSchema), isPhoneValid, addNewAddress);

router
  .route('/addresses/:addressId')
  .get(isAuthenticated, getAddressById)
  .put(isAuthenticated, validateSchema(addressSchema), isPhoneValid, updateAddress)
  .delete(isAuthenticated, deleteAddress);

router.route('/addresses/:addressId/default').put(isAuthenticated, setDefaultAddress);

export default router;
