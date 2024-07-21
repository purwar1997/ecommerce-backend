import Coupon from '../models/coupon.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import { sendResponse } from '../utils/helpers.js';
import { couponSortRules } from '../utils/sortRules.js';
import { PAGINATION, DISCOUNT_TYPES, COUPON_STATUS, COUPON_STATES } from '../constants.js';

export const getValidCoupons = handleAsync(async (_req, res) => {
  const coupons = await Coupon.find({
    expiryDate: { $gt: new Date() },
    status: COUPON_STATUS.ACTIVE,
  });

  sendResponse(res, 200, 'Valid coupons fetched successfully', coupons);
});

export const checkCouponValidity = handleAsync(async (req, res) => {
  const { couponCode } = req.query;

  const coupon = await Coupon.findOne({ code: couponCode });

  if (!coupon) {
    throw new CustomError('Coupon does not exist', 404);
  }

  if (coupon.expiryDate < new Date()) {
    throw new CustomError('Coupon has been expired', 400);
  }

  if (coupon.status === COUPON_STATUS.INACTIVE) {
    throw new CustomError('Coupon is currently inactive', 403);
  }

  sendResponse(res, 200, 'Provided coupon is valid', { valid: true, coupon });
});

export const getCoupons = handleAsync(async (req, res) => {
  const { expiryLimit, discountType, status, sort, page } = req.query;
  const filters = {};

  filters.expiryDate = {
    $lt: new Date(Date.now() + expiryLimit * 24 * 60 * 60 * 1000),
  };

  if (discountType.length > 0) {
    filters.discountType = { $in: discountType };
  }

  if (status.length > 0) {
    filters.status = { $in: status };
  }

  const sortRule = sort ? couponSortRules[sort] : { createdAt: -1 };
  const offset = (page - 1) * PAGINATION.COUPONS_PER_PAGE;
  const limit = PAGINATION.COUPONS_PER_PAGE;

  const coupons = await Coupon.find(filters).sort(sortRule).skip(offset).limit(limit);
  const couponCount = await Coupon.countDocuments(filters);

  res.set('X-Total-Count', couponCount);

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
      $unset:
        discountType === DISCOUNT_TYPES.FLAT ? { percentageDiscount: 1 } : { flatDiscount: 1 },
      status:
        coupon.expiryDate < new Date() && expiryDate > new Date()
          ? COUPON_STATUS.ACTIVE
          : coupon.status,
      lastUpdatedBy: req.user._id,
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

  if (coupon.expiryDate < new Date()) {
    throw new CustomError(
      `Expired coupon cannot be ${state === COUPON_STATES.ACTIVATE ? 'activated' : 'deactivated'}`,
      403
    );
  }

  coupon.status = state === COUPON_STATES.ACTIVATE ? COUPON_STATUS.ACTIVE : COUPON_STATUS.INACTIVE;
  coupon.activeStatusLastUpdatedBy = req.user._id;

  coupon = await coupon.save();

  sendResponse(res, 200, 'Coupon state changed successfully', coupon);
});
