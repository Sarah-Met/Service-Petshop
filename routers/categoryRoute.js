import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Create category
router.post('/', requireSignIn, isAdmin, createCategory);

// Get all categories
router.get('/', getAllCategories);

// Get single category
router.get('/:id', getSingleCategory);

// Update category
router.put('/:id', requireSignIn, isAdmin, updateCategory);

// Delete category
router.delete('/:id', requireSignIn, isAdmin, deleteCategory);

export default router; 