import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createOrder,
  getAllOrders
} from '../controllers/orderController.js';

const router = express.Router();

// Create a new order
router.post('/', requireSignIn, createOrder);

// Get all orders (admin only)
router.get('/all', requireSignIn, isAdmin, getAllOrders);

export default router; 