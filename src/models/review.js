import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be between 1 and 5 inclusive'],
      max: [5, 'Rating must be between 1 and 5 inclusive'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer',
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
      required: true,
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
