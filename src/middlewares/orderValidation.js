import Product from '../models/product.js';
import Coupon from '../models/coupon.js';
import Address from '../models/address.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';

export const validateProducts = handleAsync(async (req, _res, next) => {
  const { items } = req.body;
  const productIds = items.map(item => item.product);

  await Promise.all(
    productIds.map(async id => {
      const product = await Product.findOne({ _id: id, isDeleted: false });

      if (!product) {
        throw new CustomError('Product not found', 404);
      }
    })
  );

  next();
});

export const validateCoupon = handleAsync(async (req, _res, next) => {
  const { coupon } = req.body;

  if (coupon) {
    const validCoupon = await Coupon.findOne({
      _id: coupon,
      isDeleted: false,
      expiryDate: { $gt: Date.now() },
    });

    if (!validCoupon) {
      throw new CustomError('Coupon invalid or expired', 400);
    }
  }

  next();
});

export const validateAddress = handleAsync(async (req, _res, next) => {
  const { shippingAddress } = req.body;

  const address = await Address.findOne({ _id: shippingAddress, isDeleted: false });

  if (!address) {
    throw new CustomError('Shipping address not found', 404);
  }
  next();
});
