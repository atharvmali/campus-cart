import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import userModel from './models/userModel.js';

import connectDB from "./config/mongodb.js"; 
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import adminApiRouter from "./routes/adminApiRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Updated CORS and cookie settings
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const requireAuth = async (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            res.clearCookie('token');
            return res.redirect('/login');
        }
        req.user = user;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

// View routes
app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

app.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const userData = {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            isAccountVerified: req.user.isAccountVerified
        };
        res.render('dashboard', { userData });
    } catch (error) {
        res.redirect('/login');
    }
});

// API Endpoints
app.get('/', (req, res) => res.redirect('/login'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/order', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/admin', adminApiRouter);

// Admin Routes
app.use('/admin', adminRouter);

// Campus Cart routes
app.use('/campus-cart', cartRouter);
app.use('/stationery', (req, res) => res.redirect('/campus-cart/stationery'));
app.use('/cold-drinks-juice', (req, res) => res.redirect('/campus-cart/cold-drinks-juice'));
app.use('/breakfast-instant-food', (req, res) => res.redirect('/campus-cart/breakfast-instant-food'));
app.use('/coffee-tea', (req, res) => res.redirect('/campus-cart/coffee-tea'));
app.use('/packed-food', (req, res) => res.redirect('/campus-cart/packed-food'));
app.use('/chocolates-candy', (req, res) => res.redirect('/campus-cart/chocolates-candy'));
app.use('/ice-cream', (req, res) => res.redirect('/campus-cart/ice-cream'));
app.use('/printing-xerox', (req, res) => res.redirect('/campus-cart/printing-xerox'));
app.use('/shopping-cart', (req, res) => res.redirect('/campus-cart/shopping-cart'));
app.use('/my-orders', (req, res) => res.redirect('/campus-cart/my-orders'));

app.listen(port, () => console.log(`Server started on PORT: ${port}`));