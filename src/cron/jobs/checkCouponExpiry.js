import Coupon from '../../models/coupon.js';
import connectToDB from '../../db/index.js';
import { COUPON_STATUS } from '../../constants/common.js';

connectToDB();

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
