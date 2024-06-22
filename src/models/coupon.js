import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {},
  {
    timestamps: true,
    toObject: {
      versionKey: false,
    },
  }
);

export default mongoose.model('Coupon', couponSchema);
