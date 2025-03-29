import productModel from "../models/productModel.js";

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({ isActive: true })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Get all products error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve products',
            error: error.message
        });
    }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Category is required'
            });
        }

        const products = await productModel.find({ 
            category: { $regex: new RegExp(category, 'i') }, 
            isActive: true 
        })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Get products by category error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve products',
            error: error.message
        });
    }
};

// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const product = await productModel.findById(productId).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve product',
            error: error.message
        });
    }
};

// Admin: Create product
export const createProduct = async (req, res) => {
    try {
        const { name, category, price, stock, description, imagePath } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({
                success: false,
                message: 'Name, category, and price are required'
            });
        }

        const newProduct = new productModel({
            name,
            category,
            price,
            stock: stock || 0,
            description: description || "",
            imagePath: imagePath || "/images/sample-product.jpg"
        });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Create product error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Admin: Update product
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, category, price, stock, description, imagePath, isActive } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const updateData = {};
        
        if (name) updateData.name = name;
        if (category) updateData.category = category;
        if (price) updateData.price = price;
        if (stock !== undefined) updateData.stock = stock;
        if (description) updateData.description = description;
        if (imagePath) updateData.imagePath = imagePath;
        if (isActive !== undefined) updateData.isActive = isActive;
        
        updateData.updatedAt = Date.now();

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Update product error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// Admin: Delete product (soft delete)
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const deletedProduct = await productModel.findByIdAndUpdate(
            productId,
            { isActive: false, updatedAt: Date.now() },
            { new: true }
        );

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
}; 