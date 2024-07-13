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
import { validatePayload } from '../middlewares/requestValidators.js';
import { isPhoneValid } from '../middlewares/verifyCredentials.js';

const router = express.Router();

router
  .route('/addresses')
  .get(isAuthenticated, getAddresses)
  .post(isAuthenticated, validatePayload(addressSchema), isPhoneValid, addNewAddress);

router
  .route('/addresses/:addressId')
  .get(isAuthenticated, getAddressById)
  .put(isAuthenticated, validatePayload(addressSchema), isPhoneValid, updateAddress)
  .delete(isAuthenticated, deleteAddress);

router.route('/addresses/:addressId/default').put(isAuthenticated, setDefaultAddress);

export default router;
