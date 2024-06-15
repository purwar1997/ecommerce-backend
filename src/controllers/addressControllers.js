import Address from '../models/address.js';
import handleAsync from '../services/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';

export const getAddresses = handleAsync(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id, isDeleted: false });

  sendResponse(res, 200, 'Addresses fetched successfully', addresses);
});

export const getAddressById = handleAsync(async (req, res) => {
  const { addressId } = req.params;

  const address = await Address.findOne({ _id: addressId, isDeleted: false });

  if (!address) {
    throw new CustomError('Address not found', 404);
  }

  sendResponse(res, 200, 'Address fetched by ID successfully', address);
});

export const addNewAddress = handleAsync(async (req, res) => {
  const address = req.body;
  const userId = req.user._id;

  if (address.isDefault) {
    await Address.findOneAndUpdate(
      { user: userId, isDefault: true },
      { isDefault: false },
      { runValidators: true }
    );
  }

  const addresses = await Address.find({ user: userId, deleted: false });

  if (!addresses.length) {
    address.isDefault = true;
  }

  const newAddress = await Address.create({ ...address, user: userId });

  sendResponse(res, 201, 'Address created successfully', newAddress);
});

export const updateAddress = handleAsync(async (req, res) => {
  const { addressId } = req.params;
  const updates = req.body;

  if (!updates.isDefault) {
    const otherAddresses = await Address.find({ isDeleted: false, _id: { $ne: addressId } });

    if (!otherAddresses.length) {
      throw new CustomError(
        'Please set another address as the default before changing this address to non-default',
        409
      );
    }
  }

  if (updates.isDefault) {
    await Address.findOneAndUpdate(
      { user: req.user._id, isDefault: true },
      { isDefault: false },
      { runValidators: true }
    );
  }

  const updatedAddress = await Address.findOneAndUpdate(
    { _id: addressId, isDeleted: false },
    updates,
    { runValidators: true, new: true }
  );

  if (!updatedAddress) {
    throw new CustomError('Address not found', 404);
  }

  sendResponse(res, 200, 'Address updated successfully', updatedAddress);
});

export const deleteAddress = handleAsync(async (req, res) => {
  const { addressId } = req.params;

  const address = await Address.findOne({ _id: addressId, isDeleted: false });

  if (!address) {
    throw new CustomError('Address not found', 404);
  }

  if (address.isDefault) {
    throw new CustomError(
      'Please set another address as the default before deleting this address',
      409
    );
  }

  address.isDeleted = true;

  await address.save();

  sendResponse(res, 200, 'Address deleted successfully');
});

export const setDefaultAddress = handleAsync(async (re, res) => {
  const { addressId } = req.params;

  await Address.findOneAndUpdate(
    { user: req.user._id, isDefault: true },
    { isDefault: false },
    { runValidators: true }
  );

  const defaultAddress = await Address.findOneAndUpdate(
    { _id: addressId, isDeleted: false },
    { isDefault: true },
    { runValidators: true, new: true }
  );

  if (!defaultAddress) {
    throw new CustomError('Address not found', 404);
  }

  sendResponse(res, 200, 'Address has been set as the default successfully', defaultAddress);
});
