import express from 'express';
import {
  getAddresses,
  addNewAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressControllers.js';
import { addressSchema, addressIdSchema } from '../schemas/addressSchemas.js';
import { isHttpMethodAllowed } from '../middlewares/isHttpMethodAllowed.js';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload, validatePathParams } from '../middlewares/requestValidators.js';
import { isPhoneValid } from '../middlewares/verifyCredentials.js';

const router = express.Router();

router
  .route('/addresses')
  .all(isHttpMethodAllowed, isAuthenticated)
  .get(getAddresses)
  .post(validatePayload(addressSchema), isPhoneValid, addNewAddress);

router
  .route('/addresses/:addressId')
  .all(isHttpMethodAllowed, isAuthenticated, validatePathParams(addressIdSchema))
  .get(getAddressById)
  .put(validatePayload(addressSchema), isPhoneValid, updateAddress)
  .delete(deleteAddress);

router
  .route('/addresses/:addressId/default')
  .put(isAuthenticated, validatePathParams(addressIdSchema), setDefaultAddress);

export default router;
