import express from "express";
import { createOrder, getUserOrders, getOrderById, getOrdersByEmail } from "../controllers/orderController.js";
import userAuth from "../middleware/userAuth.js";

const orderRouter = express.Router();

// Create a new order (no auth required to allow guest checkout)
orderRouter.post('/create', createOrder);

// Get orders for logged-in user
orderRouter.get('/user-orders', userAuth, getUserOrders);

// Get specific order by ID
orderRouter.get('/:orderId', getOrderById);

// Get orders by email (for guest users)
orderRouter.get('/email/:email', getOrdersByEmail);

export default orderRouter; 