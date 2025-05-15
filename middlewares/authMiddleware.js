// authMiddleware.js
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// protected routes token base
export const requireSignIn = async (req, res, next) => {
    try {
        console.log('Checking authentication...');
        console.log('Authorization header:', req.headers.authorization);
        
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        console.log('Verifying token...');
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decode);
        
        req.user = decode;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};

// Admin access check
export const isAdmin = async (req, res, next) => {
    try {
        console.log('Checking admin access...');
        console.log('User from token:', req.user);
        
        const user = await userModel.findById(req.user._id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log('User role:', user.role);
        if (user.role !== 1) {
            console.log('User is not an admin');
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access"
            });
        }

        console.log('Admin access granted');
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        res.status(401).json({
            success: false,
            message: "Error in admin middleware",
            error: error.message
        });
    }
};
  