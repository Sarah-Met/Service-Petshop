import Product from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper function to save base64 image
const saveBase64Image = (base64String, filename) => {
    try {
        const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 string');
        }

        const imageBuffer = Buffer.from(matches[2], 'base64');
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, imageBuffer);
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('Error saving base64 image:', error);
        throw new Error('Failed to save image');
    }
};

// Create product
export const createProductController = async (req, res) => {
    try {
        console.log('Create product request received:', {
            body: req.body,
            file: req.file,
            user: req.user,
            headers: req.headers
        });

        const { name, description, price, stock } = req.body;
        // Remove category from destructuring and validation
        // Validate required fields
        if (!name || !description || !price || !stock) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Handle image upload
        let imagePath;
        try {
            if (req.file) {
                // If file is uploaded through form-data
                console.log('File uploaded:', req.file);
                imagePath = `/uploads/${req.file.filename}`;
            } else if (req.body.image) {
                // If image is sent as base64 in JSON
                console.log('Base64 image received');
                const filename = `${Date.now()}-${name}.jpg`;
                imagePath = saveBase64Image(req.body.image, filename);
            } else {
                console.log('No image provided');
                return res.status(400).json({
                    success: false,
                    error: 'Image is required'
                });
            }
        } catch (error) {
            console.error('Error handling image:', error);
            return res.status(400).json({
                success: false,
                error: 'Failed to process image: ' + error.message
            });
        }

        // Create new product
        const product = new Product({
            name,
            description,
            price,
            stock,
            image: imagePath
        });

        // Save product
        const savedProduct = await product.save();
        console.log('Product saved successfully:', savedProduct);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: savedProduct
        });
    } catch (error) {
        console.error('Error in createProductController:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Get all products
export const getProductsController = async (req, res) => {
    try {
        console.log('Getting all products - Request details:', {
            method: req.method,
            url: req.url,
            path: req.path,
            originalUrl: req.originalUrl,
            headers: req.headers,
            query: req.query
        });

        const products = await Product.find({})
            .sort({ createdAt: -1 });
        
        console.log('Products found:', {
            count: products.length,
            products: products.map(p => ({ id: p._id, name: p.name }))
        });
        
        // Always send a response with count, even if it's 0
        res.status(200).json({
            success: true,
            count: products.length,
            products: products || []
        });
    } catch (error) {
        console.error('Error in getProductsController:', {
            error: error.message,
            stack: error.stack,
            request: {
                method: req.method,
                url: req.url,
                path: req.path,
                originalUrl: req.originalUrl
            }
        });
        // Send a response with count 0 on error
        res.status(500).json({
            success: false,
            message: 'Error getting products',
            count: 0,
            products: [],
            error: error.message
        });
    }
};

// Get single product
export const getProductController = async (req, res) => {
    try {
        console.log('Getting product with ID:', req.params.id);
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('Product found:', product);
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error in getProductController:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting product',
            error: error.message
        });
    }
};

// Update product
export const updateProductController = async (req, res) => {
    try {
        console.log('Updating product with ID:', req.params.id);
        console.log('Update data:', req.body);

        const { name, description, price, stock } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (stock) updateData.stock = stock;

        // Handle image update
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            const filename = `${Date.now()}-${name || 'product'}.jpg`;
            const matches = req.body.image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid image format'
                });
            }
            const imageBuffer = Buffer.from(matches[2], 'base64');
            const filePath = path.join(__dirname, '..', 'uploads', filename);
            fs.writeFileSync(filePath, imageBuffer);
            updateData.image = `/uploads/${filename}`;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('Product updated successfully:', product);
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Error in updateProductController:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete product
export const deleteProductController = async (req, res) => {
    try {
        console.log('Deleting product with ID:', req.params.id);
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);
        
        console.log('Product deleted successfully:', product);
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            product
        });
    } catch (error) {
        console.error('Error in deleteProductController:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
}; 