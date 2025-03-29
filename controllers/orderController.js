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
        // Use either the body userId, userData._id, or extract from authenticated user info
        const userId = req.body.userId || (req.userData && req.userData._id);
        
        console.log("Request headers:", req.headers);
        console.log("Request user data:", req.userData);
        console.log("Request body:", req.body);
        
        if (!userId) {
            console.log("No userId found in request");
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        console.log("Searching for orders with userId:", userId);

        // Get orders from newest to oldest
        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        console.log(`Found ${orders.length} orders for user ${userId}`);
        
        // If no orders found with userId, check if any guest orders exist with the same email
        if (orders.length === 0 && req.userData && req.userData.email) {
            console.log("No orders found with userId, checking for guest orders with email:", req.userData.email);
            const guestOrders = await orderModel.find({ "customer.email": req.userData.email })
                .sort({ createdAt: -1 })
                .lean();
                
            if (guestOrders.length > 0) {
                console.log(`Found ${guestOrders.length} guest orders for email ${req.userData.email}`);
                return res.status(200).json({
                    success: true,
                    orders: guestOrders
                });
            }
        }

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