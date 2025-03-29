import express from "express";
import { getAllProducts, getProductsByCategory, getProductById } from "../controllers/productController.js";

const productRouter = express.Router();

// Get all products
productRouter.get('/', getAllProducts);

// Get products by category
productRouter.get('/category/:category', getProductsByCategory);

// Get product by ID
productRouter.get('/:productId', getProductById);

export default productRouter; 