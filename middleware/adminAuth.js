import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user and include the role
        const user = await userModel.findById(decoded.id);
        
        if (!user) {
            res.clearCookie('token');
            return res.redirect('/admin/login');
        }
        
        // Check if user has admin privileges
        if (user.role !== 'admin' && user.role !== 'superadmin') {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. Admin privileges required."
            });
        }
        
        // Set user data for subsequent requests
        req.user = user;
        req.userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/admin/login');
    }
};

export default adminAuth; 