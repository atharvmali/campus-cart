import express from "express";
import { adminLogin, getAllUsers, updateUserRole, getAllOrders, updateOrderStatus } from "../controllers/adminController.js";
import { createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminApiRouter = express.Router();

// Auth routes
adminApiRouter.post('/login', adminLogin);

// User management routes
adminApiRouter.get('/users', adminAuth, getAllUsers);
adminApiRouter.patch('/users/update-role', adminAuth, updateUserRole);

// Order management routes
adminApiRouter.get('/orders', adminAuth, getAllOrders);
adminApiRouter.patch('/orders/update-status', adminAuth, updateOrderStatus);

// Product management routes
adminApiRouter.post('/products', adminAuth, createProduct);
adminApiRouter.patch('/products/:productId', adminAuth, updateProduct);
adminApiRouter.delete('/products/:productId', adminAuth, deleteProduct);

export default adminApiRouter; 