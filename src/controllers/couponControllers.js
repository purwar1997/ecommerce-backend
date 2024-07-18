import Coupon from '../models/coupon.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';
import { couponSortRules } from '../utils/sortRules.js';
import { PAGINATION, DISCOUNT_TYPES, COUPON_STATES } from '../constants.js';

export const getValidCoupons = handleAsync(async (_req, res) => {
  const coupons = await Coupon.find({
    expiryDate: { $gt: new Date() },
    isActive: true,
  });

  sendResponse(res, 200, 'Valid coupons fetched successfully', coupons);
});

export const checkCouponValidity = handleAsync(async (req, res) => {
  const { code } = req.query;

  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon) {
    throw new CustomError('Coupon does not exist', 404);
  }

  if (coupon.expiryDate < new Date()) {
    throw new CustomError('Coupon has been expired', 410);
  }

  sendResponse(res, 200, 'Provided coupon is valid', { valid: true, coupon });
});

export const getCoupons = handleAsync(async (req, res) => {
  const { sort, page } = req.query;

  const sortRule = couponSortRules[sort];
  const offset = (page - 1) * PAGINATION.COUPONS_PER_PAGE;
  const limit = PAGINATION.COUPONS_PER_PAGE;

  const coupons = await Coupon.find().sort(sortRule).skip(offset).limit(limit);

  sendResponse(res, 200, 'Coupons fetched successfully', coupons);
});

export const createCoupon = handleAsync(async (req, res) => {
  const { code } = req.body;

  const existingCoupon = await Coupon.findOne({ code });

  if (existingCoupon) {
    throw new CustomError(
      'Coupon by this code already exists. Please provide a different a coupon code',
      409
    );
  }

  const newCoupon = await Coupon.create({ ...req.body, createdBy: req.user._id });

  sendResponse(res, 201, 'Coupon created successfully', newCoupon);
});

export const getCouponById = handleAsync(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new CustomError('Coupon not found', 404);
  }

  sendResponse(res, 200, 'Coupon fetched by ID successfully', coupon);
});

export const updateCoupon = handleAsync(async (req, res) => {
  const { couponId } = req.params;
  const { code, discountType, expiryDate } = req.body;

  let coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new CustomError('Coupon not found', 404);
  }

  const existingCoupon = await Coupon.findOne({ code, _id: { $ne: couponId } });

  if (existingCoupon) {
    throw new CustomError(
      'Coupon by this code already exists. Please provide a different coupon code',
      409
    );
  }

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    couponId,
    {
      ...req.body,
      isActive: coupon.expiryDate < new Date() && expiryDate > new Date() ? true : coupon.isActive,
      lastUpdatedBy: req.user._id,
      $unset:
        discountType === DISCOUNT_TYPES.FLAT ? { percentageDiscount: 1 } : { flatDiscount: 1 },
    },
    { runValidators: true, new: true }
  );

  sendResponse(res, 200, 'Coupon updated successfully', updatedCoupon);
});

export const deleteCoupon = handleAsync(async (req, res) => {
  const { couponId } = req.params;

  const deletedCoupon = await Coupon.findByIdAndDelete(couponId);

  if (!deletedCoupon) {
    throw new CustomError('Coupon not found', 404);
  }

  sendResponse(res, 200, 'Coupon deleted successfully');
});

export const changeCouponState = handleAsync(async (req, res) => {
  const { couponId } = req.params;
  const { state } = req.body;

  let coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new CustomError('Coupon not found', 404);
  }

  if (state === COUPON_STATES.ACTIVATE && coupon.expiryDate < new Date()) {
    throw new CustomError(
      'This coupon has expired. Please extend the expiry date to reactivate it',
      409
    );
  }

  coupon.isActive = state === COUPON_STATES.ACTIVATE;
  coupon.activeStatusLastUpdatedBy = req.user._id;

  coupon = await coupon.save();

  sendResponse(res, 200, 'Coupon state changed successfully', coupon);
});
