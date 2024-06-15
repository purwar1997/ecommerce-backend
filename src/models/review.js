import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      enum: {
        values: [1, 2, 3, 4, 5],
        message: 'Please provide an integer rating between 1 and 5',
      },
    },
    headline: {
      type: String,
      required: [true, 'Please provide a review headline'],
      maxLength: [100, 'Review headline cannot exceed 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Please provide a review body'],
      maxLength: [800, 'Review body cannot exceed 800 characters'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide the ID of the product being reviewed'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
    },
  }
);

export default mongoose.model('Review', reviewSchema);
