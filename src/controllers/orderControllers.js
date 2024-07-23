import Order from '../models/order.js';
import Product from '../models/product.js';
import handleAsync from '../utils/handleAsync.js';
import CustomError from '../utils/customError.js';
import sendEmail from '../services/sendEmail.js';
import { sendResponse, getCurrentDateMilliSec } from '../utils/helpers.js';
import { orderSortRules } from '../utils/sortRules.js';
import { GST, DISCOUNT_TYPES, PAGINATION, ORDER_STATUS, PAYMENT_METHODS } from '../constants.js';

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
      text: `Order with ID ${newOrder._id} has been placed successfully.`,
    };

    await sendEmail(options);
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
    throw new CustomError('Order has been already cancelled', 409);
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
        ? `Order with ID ${order._id} has been cancelled successfully. Order amount of ₹${order.totalAmount} will be refunded shortly.`
        : `Order with ID ${order._id} has been cancelled successfully.`;

    const options = {
      recipient: req.user.email,
      subject: 'Order cancellation email',
      text: emailContent,
    };

    await sendEmail(options);
  } catch (error) {
    throw new CustomError('Failed to send order cancellation email', 500);
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
      select: { name: 1, price: 1 },
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
    throw new CustomError('Status of cancelled orders cannot be updated', 403);
  }

  const currentStatusIndex = allowedStatus.indexOf(order.status);
  const newStatusIndex = allowedStatus.indexOf(status);

  if (order.status === status) {
    throw new CustomError(`This order has already been marked as ${status}`, 409);
  }

  if (newStatusIndex < currentStatusIndex) {
    throw new CustomError(`${order.status} order cannot be set back to ${status}`, 403);
  }

  if (newStatusIndex > currentStatusIndex + 1) {
    const validStatus = allowedStatus[currentStatusIndex + 1];

    throw new CustomError(
      `${order.status} order has to be marked as ${validStatus} first, only then it can be ${status}`,
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
  );

  sendResponse(res, 200, 'Order status updated successfully', updatedOrder);
});