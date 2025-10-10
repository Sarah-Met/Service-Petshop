import dotenv from 'dotenv';
// Configure environment variables
dotenv.config();
console.log('MongoDB URI:', process.env.MONGO_URI);

import express from "express";
import colors from "colors";
import morgan from 'morgan';
import connectDB from "./config/db.js";
import authRoutes from './routers/authRoute.js'
import petRoutes from './routers/petRoute.js'
import userRoutes from './routers/userRoute.js'
import categoryRoutes from './routers/categoryRoute.js'
import productRoutes from './routers/productRoute.js'
import orderRoutes from './routers/orderRoutes.js'
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Import models
import './models/userModel.js';
import './models/petModel.js';
import './models/categoryModel.js';
import './models/productModel.js';
import './models/Order.js';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads directory
const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json()); 
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

//routes
console.log('Registering routes...');

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Register routes with logging
app.use("/api/v1/auth", (req, res, next) => {
    console.log('Auth route accessed:', req.method, req.url);
    next();
}, authRoutes);

app.use("/api/v1/users", (req, res, next) => {
    console.log('Users route accessed:', req.method, req.url);
    next();
}, userRoutes);

app.use("/api/v1/pets", (req, res, next) => {
    console.log('Pets route accessed:', req.method, req.url);
    next();
}, petRoutes);

app.use("/api/v1/categories", (req, res, next) => {
    console.log('Categories route accessed:', req.method, req.url);
    next();
}, categoryRoutes);

app.use("/api/v1/orders", (req, res, next) => {
    console.log('Orders route accessed:', req.method, req.url);
    next();
}, orderRoutes);

// Products route with detailed logging
app.use("/api/v1/products", (req, res, next) => {
    console.log('Products route accessed:', {
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
}, productRoutes);

import appointmentRoutes from './routers/appointmentRoute.js';
app.use("/api/v1/appointments", (req, res, next) => {
    console.log('Appointments route accessed:', req.method, req.url);
    next();
}, appointmentRoutes);

console.log('Routes registered successfully');

// REST API route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to our pet app</h1>');
});

// Add error logging middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.body
    });
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// 404 handler with detailed logging
app.use((req, res) => {
    console.log('404 Not Found:', {
        method: req.method,
        url: req.url,
        path: req.path,
        originalUrl: req.originalUrl,
        headers: req.headers,
        body: req.body
    });
    res.status(404).json({
        success: false,
        message: 'Route not found',
        details: {
            method: req.method,
            url: req.url,
            path: req.path,
            originalUrl: req.originalUrl
        }
    });
});

// Connect to MongoDB
connectDB();

// Port
const PORT = process.env.PORT || 8080;

// Run the server
app.listen(PORT, () => {
   console.log(`Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
   console.log('Available routes:');
   console.log('- /api/v1/auth');
   console.log('- /api/v1/users');
   console.log('- /api/v1/pets');
   console.log('- /api/v1/categories');
   console.log('- /api/v1/products');
   console.log('- /api/v1/appointments');
   console.log('- /api/v1/orders');
});