import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {},
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('Order', orderSchema);
