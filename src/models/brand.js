import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },
    logo: {
      url: {
        type: String,
        required: [true, 'URL of uploaded logo is required'],
      },
      public_id: {
        type: String,
        required: [true, 'Public ID of uploaded logo is required'],
      },
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

export default mongoose.model('Brand', brandSchema);
