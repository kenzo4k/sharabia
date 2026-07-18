import { z } from 'zod';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import generateOrderNumber from '../utils/generateOrderNumber.js';

// Order Validation Schema
export const orderCreateSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().trim().min(6, 'Phone must be at least 6 characters'),
    address: z.string().trim().min(5, 'Address must be at least 5 characters')
  }),
  items: z.array(z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    size: z.string().optional(),
    color: z.string().optional()
  })).min(1, 'Order must contain at least one item'),
  shippingMethod: z.enum(['standard', 'express']).optional().default('standard'),
  utmSource: z.string().optional().default('direct')
});

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Public
 */
export const createOrder = async (req, res, next) => {
  try {
    const validatedData = orderCreateSchema.parse(req.body);
    const { customer, items, shippingMethod, utmSource } = validatedData;

    // 2. Fetch products and calculate totals server-side (prevent pricing fraud)
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found with ID: ${item.productId}`);
      }

      // Basic stock validation
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.stock}`);
      }

      const itemPrice = product.price;
      const itemSubtotal = itemPrice * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        size: item.size || 'One Size',
        color: item.color || product.colors[0] || 'Default',
        image: product.images[0] || 'https://picsum.photos/600/450?random=1'
      });
    }

    // 3. Calculate shipping, tax and total
    const shippingCost = shippingMethod === 'express' ? 10 : 0;
    const taxRate = 0.08; // 8% tax rate
    const tax = Math.round((subtotal * taxRate) * 100) / 100;
    const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

    // 4. Generate unique order number
    const orderNumber = generateOrderNumber();

    // 5. Save order in pending state
    const order = new Order({
      orderNumber,
      userId: req.user ? req.user._id : undefined,
      customer,
      items: orderItems,
      shippingMethod,
      shippingCost,
      subtotal,
      tax,
      total,
      paymentStatus: 'pending',
      orderStatus: 'processing',
      utmSource: utmSource || 'direct'
    });

    const savedOrder = await order.save();

    // Deduct stock levels immediately for the items in the order
    try {
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
        console.log(`Deducted stock for product ${item.productId} by ${item.quantity}`);
      }
    } catch (stockErr) {
      console.error('Error decrementing stock on order save:', stockErr);
    }

    res.status(201).json({
      success: true,
      order: savedOrder
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get order details by ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all orders (paginated)
 * @route   GET /api/orders
 * @access  Private (Admin Only)
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skipNum = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments({});
    const totalPages = Math.ceil(totalOrders / limitNum);

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: pageNum,
        limit: limitNum
      },
      orders
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin Only)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = ['pending_approval', 'processing', 'shipped', 'delivered', 'succeeded', 'failed'];
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      res.status(400);
      throw new Error(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const updates = { orderStatus };
    if (orderStatus === 'succeeded' || orderStatus === 'delivered') {
      updates.paymentStatus = 'paid';
    } else if (orderStatus === 'failed') {
      updates.paymentStatus = 'failed';
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/my
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (err) {
    next(err);
  }
};
