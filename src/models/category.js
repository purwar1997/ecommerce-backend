import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Category title is required'],
    },
    image: {
      url: String,
      public_id: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
    },
  }
);

export default mongoose.model('Category', categorySchema);
