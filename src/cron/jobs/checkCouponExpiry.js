import Coupon from '../../models/coupon.js';
import connectDB from '../../db/index.js';
import { COUPON_STATUS } from '../../constants/common.js';

connectDB();

export const checkCouponExpiry = async () => {
  try {
    await Coupon.updateMany(
      {
        expiryDate: { $lt: new Date() },
        status: { $ne: COUPON_STATUS.EXPIRED },
      },
      {
        status: COUPON_STATUS.EXPIRED,
      }
    );
  } catch (error) {
    console.log('Error checking expiry date of coupons');
    console.error(error);
  }
};
