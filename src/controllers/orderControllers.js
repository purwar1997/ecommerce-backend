import Order from '../models/order.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import sendEmail from '../services/sendEmail.js';
import { sendResponse } from '../utils/helpers.js';
import { GST_RATE, DISCOUNT_TYPES } from '../constants.js';

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

  const taxAmount = orderAmount * GST_RATE + shippingCharges * GST_RATE;
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
