import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Product name is required.'],
    maxLength: [100, 'Product name should be less than 100 characters.'],
  },
});
