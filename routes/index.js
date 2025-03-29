import authRoutes from "./authRoutes.js";
import cartRoutes from "./cartRoutes.js";
import userRoutes from './userRoutes.js';
import orderRoutes from './orderRoutes.js';

export { authRoutes, cartRoutes, userRoutes, orderRoutes };

// Printing & Xerox page route
router.get('/printing-xerox', authenticateToken, (req, res) => {
    const userData = req.userData;
    res.render('printing-xerox', { userData });
}); 