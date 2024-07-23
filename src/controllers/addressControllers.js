import Address from '../models/address.js';
import handleAsync from '../utils/handleAsync.js';
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

  if (address.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who owns this address can view it', 403);
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

  const addressCount = await Address.countDocuments({ user: userId, isDeleted: false });

  if (!addressCount) {
    address.isDefault = true;
  }

  const newAddress = await Address.create({ ...address, user: userId });

  sendResponse(res, 201, 'Address created successfully', newAddress);
});

export const updateAddress = handleAsync(async (req, res) => {
  const { addressId } = req.params;
  const updates = req.body;

  const address = await Address.findOne({ _id: addressId, isDeleted: false });

  if (!address) {
    throw new CustomError('Address not found', 404);
  }

  if (address.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who owns this address can update it', 403);
  }

  if (!updates.isDefault) {
    const addressCount = await Address.countDocuments({
      _id: { $ne: addressId },
      isDeleted: false,
    });

    if (!addressCount) {
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

  const updatedAddress = await Address.findByIdAndUpdate(addressId, updates, {
    runValidators: true,
    new: true,
  });

  sendResponse(res, 200, 'Address updated successfully', updatedAddress);
});

export const deleteAddress = handleAsync(async (req, res) => {
  const { addressId } = req.params;

  const address = await Address.findOne({ _id: addressId, isDeleted: false });

  if (!address) {
    throw new CustomError('Address not found', 404);
  }

  if (address.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who owns this address can delete it', 403);
  }

  if (address.isDefault) {
    throw new CustomError(
      'Please set another address as the default before deleting this address',
      409
    );
  }

  address.isDeleted = true;
  await address.save();

  sendResponse(res, 200, 'Address deleted successfully', addressId);
});

export const setDefaultAddress = handleAsync(async (req, res) => {
  const { addressId } = req.params;

  const address = await Address.findOne({ _id: addressId, isDeleted: false });

  if (!address) {
    throw new CustomError('Address not found', 404);
  }

  if (address.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who owns this address can set it as default', 403);
  }

  await Address.findOneAndUpdate(
    { user: req.user._id, isDefault: true },
    { isDefault: false },
    { runValidators: true }
  );

  address.isDefault = true;
  const defaultAddress = await address.save();

  sendResponse(res, 200, 'Address has been set as the default successfully', defaultAddress);
});
