import express from 'express';
import { createOrder, getOrderById, getAllOrders, updateOrderStatus, getMyOrders } from '../controllers/orderController.js';
import { protect, adminOnly, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders - Create a new order
router.post('/', optionalProtect, createOrder);

// GET /api/orders/my - Get logged in user's orders
router.get('/my', protect, getMyOrders);

// GET /api/orders - Get all orders (Admin Only)
router.get('/', protect, adminOnly, getAllOrders);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById);

// PUT /api/orders/:id/status - Update order status (Admin Only)
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
