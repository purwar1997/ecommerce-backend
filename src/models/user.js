import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/config.js';
import { nameRegex, emailRegex, phoneRegex, passwordRegex } from '../utils/regex.js';
import { ROLES, JWT_EXPIRY } from '../constants.js';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'First name is required'],
      match: [nameRegex, 'First name must contain only alphabets'],
    },
    lastname: {
      type: String,
      match: [nameRegex, 'Last name must contain only alphabets'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      immutable: true,
      match: [emailRegex, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
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
    avatar: {
      public_id: String,
      url: String,
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
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
      virtuals: true,
      transform: function (_doc, res) {
        delete res.id;
        return res;
      },
    },
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
    const token = jwt.sign(
      {
        userId: this._id,
        role: this.role,
      },
      config.JWT_SECRET_KEY,
      {
        expiresIn: JWT_EXPIRY,
      }
    );

    return token;
  },

  generateForgotPasswordToken() {
    const token = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.resetPasswordExpiry = new Date(Date.now() + 30 * 60 * 1000);

    return token;
  },
};

export default mongoose.model('User', userSchema);
