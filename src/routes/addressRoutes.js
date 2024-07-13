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
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { validatePayload, validatePathParams } from '../middlewares/requestValidators.js';
import { isPhoneValid } from '../middlewares/verifyCredentials.js';

const router = express.Router();

router
  .route('/addresses')
  .get(isAuthenticated, getAddresses)
  .post(isAuthenticated, validatePayload(addressSchema), isPhoneValid, addNewAddress);

router
  .route('/addresses/:addressId')
  .get(isAuthenticated, validatePathParams(addressIdSchema), getAddressById)
  .put(
    isAuthenticated,
    validatePathParams(addressIdSchema),
    validatePayload(addressSchema),
    isPhoneValid,
    updateAddress
  )
  .delete(isAuthenticated, validatePathParams(addressIdSchema), deleteAddress);

router
  .route('/addresses/:addressId/default')
  .put(isAuthenticated, validatePathParams(addressIdSchema), setDefaultAddress);

export default router;
