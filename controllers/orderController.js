import Order from '../models/Order.js';
import User from '../models/userModel.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, adoptionSignature } = req.body;
    let adoptionAgreementPath = null;
    if (req.file) {
      adoptionAgreementPath = `/uploads/${req.file.filename}`;
    }
    // Parse items if sent as JSON string
    let parsedItems = items;
    if (typeof items === 'string') {
      parsedItems = JSON.parse(items);
    }
    const order = new Order({
      user: req.user._id,
      items: parsedItems,
      totalAmount,
      adoptionAgreement: adoptionAgreementPath,
      adoptionSignature
    });
    await order.save();

    // Fetch the populated order for debugging
    const populatedOrder = await Order.findById(order._id).populate('items.product');
    console.log('Populated order:', JSON.stringify(populatedOrder, null, 2));

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

// Update agreement status (admin only)
export const updateAgreementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { agreementStatus } = req.body;
    if (!['accepted', 'rejected'].includes(agreementStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      id,
      { agreementStatus },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 