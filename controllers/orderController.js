import Order from '../models/Order.js';
import User from '../models/userModel.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    // Create the order
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount
    });

    await order.save();

    // Notify all admin users
    const admins = await User.find({ role: 1 });
    const adminEmails = admins.map(admin => admin.email);

    // Log admin notification (in a real app, you'd send emails here)
    console.log('New order notification sent to admins:', adminEmails);
    console.log('Order details:', {
      orderId: order._id,
      user: req.user.email,
      totalAmount: order.totalAmount,
      items: order.items
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
}; 