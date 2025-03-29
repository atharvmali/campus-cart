import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';

// Admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('admin/login', { 
                error: 'Email and password are required' 
            });
        }

        // Find the user
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.render('admin/login', { 
                error: 'Invalid credentials' 
            });
        }

        // Check if user has admin role
        if (user.role !== 'admin' && user.role !== 'superadmin') {
            return res.render('admin/login', { 
                error: 'Access denied. Admin privileges required.' 
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('admin/login', { 
                error: 'Invalid credentials' 
            });
        }

        // Generate JWT token with role
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Redirect to admin dashboard
        return res.redirect('/admin/dashboard');

    } catch (error) {
        console.error('Admin login error:', error);
        return res.render('admin/login', { 
            error: 'An error occurred during login' 
        });
    }
};

// Get all users for admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, {
            password: 0,
            verifyOtp: 0,
            verifyOtpExpireAt: 0,
            resetOtp: 0,
            resetOtpExpireAt: 0
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve users',
            error: error.message
        });
    }
};

// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!userId || !role) {
            return res.status(400).json({
                success: false,
                message: 'User ID and role are required'
            });
        }

        // Check if role is valid
        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        // Only superadmin can create another superadmin
        if (role === 'superadmin' && req.user.role !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Only superadmins can create superadmin accounts'
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { role },
            { new: true, select: '-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt' }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user role error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update user role',
            error: error.message
        });
    }
};

// Get all orders for admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .lean();

        // Ensure we're returning a valid orders array even if empty
        return res.status(200).json({
            success: true,
            orders: orders || []
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders',
            error: error.message
        });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Order ID and status are required'
            });
        }

        // Check if status is valid
        if (!['pending', 'processing', 'ready', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Update order status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
}; 