import Order from '../models/order.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import sendEmail from '../services/sendEmail.js';
import { sendResponse, getCurrentDateMilliSec } from '../utils/helpers.js';
import { GST, DISCOUNT_TYPES, PAGINATION } from '../constants.js';

export const createOrder = handleAsync(async (req, res) => {
  const { items, shippingCharges } = req.body;
  const { user, coupon } = req;

  const orderAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

  let discount;

  if (coupon) {
    const { discountType, flatDiscount, percentageDiscount } = coupon;

    if (discountType === DISCOUNT_TYPES.FLAT) {
      if (orderAmount < flatDiscount) {
        throw new CustomError(
          `Order amount must be atleast ₹${flatDiscount} to apply this coupon`,
          400
        );
      }

      discount = flatDiscount;
    } else {
      discount = (percentageDiscount * orderAmount) / 100;
    }
  }

  const taxAmount = orderAmount * GST.RATE + shippingCharges * GST.RATE;
  const totalAmount = orderAmount - discount + shippingCharges + taxAmount;

  const newOrder = await Order.create({
    ...req.body,
    orderAmount,
    discount,
    taxAmount,
    totalAmount,
    user: user._id,
  });

  user.cart = [];
  await user.save();

  await Promise.all(
    items.map(async item => {
      const { product: id, quantity } = item;

      const product = await Product.findById(id);
      product.stock = product.stock - quantity;
      product.soldUnits = product.soldUnits + quantity;

      await product.save();
    })
  );

  try {
    await sendEmail({
      recepient: user.email,
      subject: 'Order confirmation email',
      text: `Order with ID ${newOrder._id} has been placed successfully`,
    });
  } catch (error) {
    throw new CustomError('Failed to send order confirmation email to the user', 500);
  }

  sendResponse(res, 201, 'Order created successfully', newOrder);
});

export const getOrders = handleAsync(async (req, res) => {
  const { duration, page } = req.query;

  const filters = {
    user: req.user._id,
    createdAt: {
      $gt: new Date(getCurrentDateMilliSec() - (duration - 1) * 24 * 60 * 60 * 1000),
    },
    isDeleted: false,
  };

  const sortRule = { createdAt: -1 };
  const offset = (page - 1) * PAGINATION.ORDERS_PER_PAGE;
  const limit = PAGINATION.ORDERS_PER_PAGE;

  const orders = await Order.find(filters).sort(sortRule).skip(offset).limit(limit);

  sendResponse(res, 200, 'Orders fetched successfully', orders);
});