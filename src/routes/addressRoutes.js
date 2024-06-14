import express from 'express';
import {
  getAddresses,
  addNewAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressControllers.js';
import { addressSchema } from '../schemas/addressSchema.js';
import authenticate from '../middlewares/authenticate.js';
import validateSchema from '../middlewares/validateSchema.js';

const router = express.Router();

router
  .route('/addresses')
  .get(authenticate, getAddresses)
  .post(authenticate, validateSchema(addressSchema), addNewAddress);

router
  .route('/addresses/:addressId')
  .get(authenticate, getAddressById)
  .put(authenticate, validateSchema(addressSchema), updateAddress)
  .delete(authenticate, deleteAddress);

router.route('/addresses/:addressId/default').put(authenticate, setDefaultAddress);

export default router;
