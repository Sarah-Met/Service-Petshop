import express from 'express';
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
import { 
    createProductController, 
    getProductsController, 
    getProductController, 
    updateProductController, 
    deleteProductController 
} from '../controllers/productController.js';
import { upload, handleMulterError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Debug middleware for all product routes
router.use((req, res, next) => {
    console.log('Product route handler accessed:', {
        method: req.method,
        url: req.url,
        path: req.path,
        originalUrl: req.originalUrl,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query
    });
    next();
});

// Get all products - This should be first to avoid conflicts with /:id route
router.get('/', getProductsController);

// Create product
router.post('/', requireSignIn, isAdmin, upload.single('image'), handleMulterError, createProductController);

// Get single product
router.get('/:id', getProductController);

// Update product
router.put('/:id', requireSignIn, isAdmin, upload.single('image'), handleMulterError, updateProductController);

// Delete product
router.delete('/:id', requireSignIn, isAdmin, deleteProductController);

export default router; 