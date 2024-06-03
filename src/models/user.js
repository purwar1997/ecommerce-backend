import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';
import { emailRegex, phoneRegex, passwordRegex } from '../utils/regex.js';
import { ROLES, JWT_EXPIRY } from '../constants.js';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Firstname is required'],
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      immutable: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [phoneRegex, 'Please provide a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      match: [
        passwordRegex,
        'Password must be 6-20 characters long and should contain atleast one digit, one letter and one special character',
      ],
      select: false,
    },
    role: {
      type: String,
      default: ROLES.USER,
      enum: {
        values: Object.values(ROLES),
        message: 'Invalid role',
      },
    },
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          validate: {
            validator: function (v) {
              return Number.isInteger(v) && v > 0;
            },
            message: 'Quantity must be a positive integer',
          },
        },
      },
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    profilePhoto: String,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.virtual('fullname').get(function () {
  return `${this.firstname} ${this.lastname}`;
});

userSchema.methods = {
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  },

  generateJWTToken() {
    const token = jwt.sign({ userId: this._id }, config.JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRY,
    });

    return token;
  },

  generateForgotPasswordToken() {
    const token = crypto.randomBytes(256).toString('hex');
    this.forgotPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.forgotPasswordExpiry = new Date(Date.now() + 30 * 60 * 1000);

    return token;
  },
};

export default mongoose.model('User', userSchema);
