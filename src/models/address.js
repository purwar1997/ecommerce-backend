import mongoose from 'mongoose';
import { fullnameRegex, phoneRegex, postalCodeRegex } from '../utils/regex.js';

const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      match: [fullnameRegex, 'Full name must contain only letters'],
      maxLength: [100, 'Full name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [phoneRegex, 'Please enter a valid phone number for delivery issues'],
    },
    line1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      maxLength: [200, 'Address line 1 cannot exceed 200 characters'],
    },
    line2: {
      type: String,
      maxLength: [200, 'Address line 2 cannot exceed 200 characters'],
    },
    landmark: {
      type: String,
      maxLength: [200, 'Landmark cannot exceed 200 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      match: [postalCodeRegex, 'Please enter a valid postal code'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'The ID of the user who added this address is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
    },
  }
);

export default mongoose.model('Address', addressSchema);
