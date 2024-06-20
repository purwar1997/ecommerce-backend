import mongoose from 'mongoose';
import { MIN_RATING, MAX_RATING } from '../constants.js';

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [MIN_RATING, `Rating must be at least ${MIN_RATING}`],
      max: [MAX_RATING, `Rating must be at most ${MAX_RATING}`],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer',
      },
    },
    headline: {
      type: String,
      required: [true, 'Review headline is required'],
      maxLength: [100, 'Review headline cannot exceed 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Review body is required'],
      maxLength: [800, 'Review body cannot exceed 800 characters'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'The ID of the product being reviewed is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The ID of the user who added this review is required'],
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
