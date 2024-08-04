import { v4 as uuidv4 } from 'uuid';
import Order from '../models/order.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import razorpay from '../config/razorpay.config.js';
import config from '../config/env.config.js';
import sendEmail from '../services/sendEmail.js';
import { orderSortRules } from '../utils/sortRules.js';
import {
  sendResponse,
  getCurrentDateMilliSec,
  getDateString,
  generateHmacSha256,
} from '../utils/helperFunctions.js';
import { GST, DISCOUNT_TYPES, PAGINATION, ORDER_STATUS } from '../constants/common.js';

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
          `Order amount must be at least ₹${flatDiscount} to apply this coupon`,
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

  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: 'INR',
    receipt: uuidv4(),
  });

  const order = await Order.create({
    _id: razorpayOrder.id,
    ...req.body,
    orderAmount,
    discount,
    taxAmount,
    totalAmount,
    user: user._id,
  });

  sendResponse(res, 201, 'Order created successfully', order);
});

export const confirmOrder = handleAsync(async (req, res) => {
  const { orderId } = req.params;
  const { paymentId, paymentSignature } = req.body;
  const { user } = req;

  const order = await Order.findOne({ _id: orderId, isDeleted: false });

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (order.isPaid) {
    throw new CustomError('Order has already been confirmed', 409);
  }

  const generatedSignature = generateHmacSha256(
    orderId + '|' + paymentId,
    config.razorpay.keySecret
  );

  if (paymentSignature !== generatedSignature) {
    throw new CustomError('Invalid payment signature', 400);
  }

  order.isPaid = true;
  order.paymentId = paymentId;
  await order.save();

  user.cart = [];
  await user.save();

  await Promise.all(
    order.items.map(async item => {
      const product = await Product.findById(item.product);
      product.stock = product.stock - item.quantity;
      product.soldUnits = product.soldUnits + item.quantity;
      await product.save();
    })
  );

  try {
    const options = {
      recepient: user.email,
      subject: 'Order confirmation email',
      text: `Order #${order._id} has been placed successfully.`,
    };

    await sendEmail(options);
  } catch (error) {
    throw new CustomError('Failed to send order confirmation email to the user', 500);
  }

  sendResponse(res, 200, 'Order placed successfully', order);
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

  const orders = await Order.find(filters)
    .sort(sortRule)
    .skip(offset)
    .limit(limit)
    .populate({
      path: 'items.product',
      select: { title: 1, description: 1, price: 1, image: 1, isDeleted: 1 },
    });

  const orderCount = await Order.countDocuments(filters);

  res.set('X-Total-Count', orderCount);

  sendResponse(res, 200, 'Orders fetched successfully', orders);
});

export const getOrderById = handleAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, isDeleted: false })
    .populate({
      path: 'items.product',
      select: { title: 1, description: 1, price: 1, image: 1 },
    })
    .populate('shippingAddress');

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who placed this order can view it', 403);
  }

  sendResponse(res, 200, 'Order fetched by ID successfully', order);
});

export const cancelOrder = handleAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, isDeleted: false });

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new CustomError('Only the user who placed this order can cancel it', 403);
  }

  if (order.status === ORDER_STATUS.CANCELLED) {
    throw new CustomError('This order has already been cancelled', 409);
  }

  if (order.status === ORDER_STATUS.DELIVERED) {
    throw new CustomError('Delivered orders cannot be cancelled', 409);
  }

  const cancelledOrder = await Order.findByIdAndUpdate(
    orderId,
    { status: ORDER_STATUS.CANCELLED },
    { runValidators: true, new: true }
  ).populate({
    path: 'items.product',
    select: { title: 1, description: 1, price: 1, image: 1, isDeleted: 1 },
  });

  await Promise.all(
    order.items.map(async item => {
      const product = await Product.findById(item.product);
      product.stock = product.stock + item.quantity;
      product.soldUnits = product.soldUnits - item.quantity;
      await product.save();
    })
  );

  if (
    order.paymentMethod === PAYMENT_METHODS.DEBIT_CARD ||
    order.paymentMethod === PAYMENT_METHODS.CREDIT_CARD
  ) {
    // Refund money to the user
  }

  try {
    const emailContent =
      order.paymentMethod === PAYMENT_METHODS.DEBIT_CARD ||
      order.paymentMethod === PAYMENT_METHODS.CREDIT_CARD
        ? `Order #${order._id} has been cancelled successfully. Order amount of ₹${order.totalAmount} will be refunded shortly.`
        : `Order #${order._id} has been cancelled successfully.`;

    const options = {
      recipient: req.user.email,
      subject: 'Order cancellation email',
      text: emailContent,
    };

    await sendEmail(options);
  } catch (error) {
    throw new CustomError('Failed to send order cancellation email to the user', 500);
  }

  sendResponse(res, 200, 'Order cancelled successfully', cancelledOrder);
});

export const adminGetOrders = handleAsync(async (req, res) => {
  const { duration, status, sort, page } = req.query;

  const filters = {
    createdAt: { $gt: getCurrentDateMilliSec() - (duration - 1) * 24 * 60 * 60 * 1000 },
    isDeleted: false,
  };

  if (status.length > 0) {
    filters.status = { $in: status };
  }

  const sortRule = orderSortRules[sort];
  const offset = (page - 1) * PAGINATION.ORDERS_PER_PAGE;
  const limit = PAGINATION.ORDERS_PER_PAGE;

  const orders = await Order.find(filters)
    .sort(sortRule)
    .skip(offset)
    .limit(limit)
    .populate({
      path: 'items.product',
      select: { title: 1, price: 1 },
    });

  const orderCount = await Order.countDocuments(filters);

  res.set('X-Total-Count', orderCount);

  sendResponse(res, 200, 'Orders fetched successfully', orders);
});

export const adminGetOrderById = handleAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate({
      path: 'items.product',
      select: { title: 1, description: 1, price: 1, image: 1 },
    })
    .populate('shippingAddress');

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  sendResponse(res, 200, 'Order fetched by ID successfully', order);
});

export const updateOrderStatus = handleAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatus = Object.values(ORDER_STATUS).filter(
    status => status !== ORDER_STATUS.CANCELLED
  );

  const order = await Order.findOne({ _id: orderId, isDeleted: false });

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (order.status === ORDER_STATUS.CANCELLED) {
    throw new CustomError('Cannot update status of a cancelled order', 403);
  }

  const currentStatusIndex = allowedStatus.indexOf(order.status);
  const newStatusIndex = allowedStatus.indexOf(status);

  if (order.status === status) {
    throw new CustomError(`This order is already marked as ${status}`, 409);
  }

  if (newStatusIndex < currentStatusIndex) {
    throw new CustomError(`Cannot change order status from ${order.status} back to ${status}`, 403);
  }

  if (newStatusIndex > currentStatusIndex + 1) {
    const validStatus = allowedStatus[currentStatusIndex + 1];

    throw new CustomError(
      `Order status must be updated to ${validStatus} before it can be changed to ${status}`,
      403
    );
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      status,
      statusLastUpdatedBy: req.user._id,
      statusUpdatedAt: new Date(),
    },
    { runValidators: true, new: true }
  ).populate({
    path: 'items.product',
    select: { title: 1, price: 1 },
  });

  sendResponse(res, 200, 'Order status updated successfully', updatedOrder);
});

export const deleteOrder = handleAsync(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, isDeleted: false },
    { isDeleted: true, deletedBy: req.user._id, deletedAt: new Date() },
    { runValidators: true }
  ).populate({
    path: 'user',
    select: { fullname: 1, email: 1 },
  });

  if (!order) {
    throw new CustomError('Order not found', 404);
  }

  if (
    order.status === ORDER_STATUS.CREATED ||
    order.status === ORDER_STATUS.PROCESSING ||
    order.status === ORDER_STATUS.SHIPPED
  ) {
    await Promise.all(
      order.items.map(async item => {
        const product = await Product.findById(item.product);
        product.stock = product.stock + item.quantity;
        product.soldUnits = product.soldUnits - item.quantity;
        await product.save();
      })
    );

    if (
      order.paymentMethod === PAYMENT_METHODS.DEBIT_CARD ||
      order.paymentMethod === PAYMENT_METHODS.CREDIT_CARD
    ) {
      // Refund order amount
    }

    try {
      const options = {
        recipient: order.user.email,
        subject: 'Order deletion email',
        text: `Dear ${fullname}, we regret to inform you that your order #${orderId} placed on ${getDateString(
          order.createdAt
        )}, has been deleted.`,
      };

      await sendEmail(options);
    } catch (error) {
      throw new CustomError('Failed to send order deletion email to the user', 500);
    }
  }

  sendResponse(res, 200, 'Order deleted successfully', orderId);
});
