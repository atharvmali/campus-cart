import express from "express";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

// Admin login page (public)
adminRouter.get('/login', (req, res) => {
    res.render('admin/login', { error: null });
});

// Admin dashboard (protected)
adminRouter.get('/dashboard', adminAuth, (req, res) => {
    res.render('admin/dashboard', { userData: req.userData });
});

// Admin products management (protected)
adminRouter.get('/products', adminAuth, (req, res) => {
    res.render('admin/products', { userData: req.userData });
});

// Admin orders management (protected)
adminRouter.get('/orders', adminAuth, (req, res) => {
    res.render('admin/orders', { userData: req.userData });
});

// Admin users management (protected)
adminRouter.get('/users', adminAuth, (req, res) => {
    res.render('admin/users', { userData: req.userData });
});

// Admin logout
adminRouter.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
});

export default adminRouter; 