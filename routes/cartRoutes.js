import express from "express";
import userAuth from "../middleware/userAuth.js";

const cartRouter = express.Router();

// Campus Cart main page - can be accessed by anyone
cartRouter.get('/', (req, res) => {
    res.render('campus-cart', { 
        userData: req.userData || null
    });
});

// Shopping cart page - can be accessed by anyone to view items, no auth required
cartRouter.get('/shopping-cart', (req, res) => {
    res.render('shopping-cart', { 
        userData: req.userData || null
    });
});

// My orders page - requires authentication
cartRouter.get('/my-orders', userAuth, (req, res) => {
    res.render('my-orders', { 
        userData: req.userData || null
    });
});

// Category routes
cartRouter.get('/stationery', (req, res) => {
    res.render('category', { 
        userData: req.userData || null,
        category: 'Stationery'
    });
});

cartRouter.get('/cold-drinks-juice', (req, res) => {
    res.render('category', { 
        userData: req.userData || null,
        category: 'Cold Drinks & Juice'
    });
});

cartRouter.get('/breakfast-instant-food', (req, res) => {
    res.render('category', { 
        userData: req.userData || null,
        category: 'Breakfast & Instant Food'
    });
});

cartRouter.get('/coffee-tea', (req, res) => {
    res.render('category', { 
        userData: req.userData || null,
        category: 'Coffee & Tea'
    });
});

cartRouter.get('/packed-food', (req, res) => {
    res.render('category', { 
        userData: req.userData || null,
        category: 'Packed Food'
    });
});

cartRouter.get('/chocolates-candy', (req, res) => {
    res.render('category', { 
        userData: req.userData || null,
        category: 'Chocolates & Candy'
    });
});

cartRouter.get('/ice-cream', (req, res) => {
    res.render('category', { 
        userData: req.userData || null,
        category: 'Ice Cream'
    });
});

cartRouter.get('/printing-xerox', (req, res) => {
    res.render('printing-xerox', { 
        userData: req.userData || null
    });
});

export default cartRouter; 