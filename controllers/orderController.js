import orderModel from "../models/orderModel.js";

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { customer, pickup, paymentMode, items, total } = req.body;

        // Validate required fields
        if (!customer || !pickup || !paymentMode || !items || !total) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required order information" 
            });
        }

        // Create order object
        const orderData = {
            customer,
            pickup,
            paymentMode,
            items,
            total,
            status: 'pending'
        };

        // Add user ID if logged in
        if (req.body.userId) {
            orderData.userId = req.body.userId;
        }

        // Save to database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            orderId: newOrder._id
        });
    } catch (error) {
        console.error("Order creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
};

// Get orders for a user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.body.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Get orders from newest to oldest
        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get user orders error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve orders",
            error: error.message
        });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        const order = await orderModel.findById(orderId).lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Get order error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve order",
            error: error.message
        });
    }
};

// Get orders by customer email (for guest users)
export const getOrdersByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const orders = await orderModel.find({ "customer.email": email })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get orders by email error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve orders",
            error: error.message
        });
    }
}; 