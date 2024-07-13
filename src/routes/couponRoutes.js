import express from 'express';
import {
  getValidCoupons,
  checkCouponValidity,
  getCoupons,
  createCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  changeCouponState,
} from '../controllers/couponControllers.js';
import { couponSchema, couponStateSchema, couponCodeSchema } from '../schemas/couponSchemas.js';
import { paginationSchema } from '../schemas/commonSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { validatePayload, validateQueryParams } from '../middlewares/requestValidators.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router.route('/coupons').get(isAuthenticated, getValidCoupons);

router
  .route('/coupons/validity')
  .get(isAuthenticated, validateQueryParams(couponCodeSchema), checkCouponValidity);

router
  .route('/admin/coupons')
  .get(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validateQueryParams(paginationSchema),
    getCoupons
  )
  .post(isAuthenticated, authorizeRole(ROLES.ADMIN), validatePayload(couponSchema), createCoupon);

router
  .route('/admin/coupons/:couponId')
  .get(isAuthenticated, authorizeRole(ROLES.ADMIN), getCouponById)
  .put(isAuthenticated, authorizeRole(ROLES.ADMIN), validatePayload(couponSchema), updateCoupon)
  .delete(isAuthenticated, authorizeRole(ROLES.ADMIN), deleteCoupon);

router
  .route('/admin/coupons/:couponId/state')
  .patch(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validatePayload(couponStateSchema),
    changeCouponState
  );

export default router;
