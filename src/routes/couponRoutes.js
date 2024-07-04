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
import { couponSchema, couponStateSchema } from '../schemas/couponSchemas.js';
import { isAuthenticated, authorizeRole } from '../middlewares/authMiddlewares.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { ROLES } from '../constants.js';

const router = express.Router();

router.route('/coupons').get(isAuthenticated, getValidCoupons);

router.route('/coupons/validity').get(isAuthenticated, checkCouponValidity);

router
  .route('/admin/coupons')
  .get(isAuthenticated, authorizeRole(ROLES.ADMIN), getCoupons)
  .post(isAuthenticated, authorizeRole(ROLES.ADMIN), validateSchema(couponSchema), createCoupon);

router
  .route('/admin/coupons/:couponId')
  .get(isAuthenticated, authorizeRole(ROLES.ADMIN), getCouponById)
  .put(isAuthenticated, authorizeRole(ROLES.ADMIN), validateSchema(couponSchema), updateCoupon)
  .delete(isAuthenticated, authorizeRole(ROLES.ADMIN), deleteCoupon);

router
  .route('/admin/coupons/:couponId/state')
  .patch(
    isAuthenticated,
    authorizeRole(ROLES.ADMIN),
    validateSchema(couponStateSchema),
    changeCouponState
  );

export default router;
