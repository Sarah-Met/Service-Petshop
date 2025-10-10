import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateAgreementStatus
} from '../controllers/orderController.js';
import { upload, handleMulterError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Create a new order
router.post('/', requireSignIn, upload.single('adoptionAgreement'), handleMulterError, createOrder);

// Get user's own orders
router.get('/', requireSignIn, getUserOrders);

// Get all orders (admin only)
router.get('/all', requireSignIn, isAdmin, getAllOrders);

// Update agreement status (admin only)
router.patch('/:id/agreement-status', requireSignIn, isAdmin, updateAgreementStatus);

export default router; 