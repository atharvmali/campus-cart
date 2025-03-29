import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://twinsbro:twinsbro123@cluster0.zromy.mongodb.net/campus-cart');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 100
    },
    description: {
        type: String,
        default: ""
    },
    imagePath: {
        type: String,
        default: "/images/sample-product.jpg"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create model
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// Products data
const products = [
    // Stationery category
    {
        name: "Pencil",
        category: "stationery",
        price: 10,
        stock: 200,
        description: "High-quality writing pencil",
        imagePath: "/images/pencil.jpeg"
    },
    {
        name: "Eraser",
        category: "stationery",
        price: 10,
        stock: 150,
        description: "Soft eraser for clean corrections",
        imagePath: "/images/Eraser.jpeg"
    },
    {
        name: "Document Folder",
        category: "stationery",
        price: 70,
        stock: 80,
        description: "Durable document folder for storing papers",
        imagePath: "/images/Floder.jpeg"
    },
    {
        name: "Calculator",
        category: "stationery",
        price: 410,
        stock: 50,
        description: "Scientific calculator for engineering and science students",
        imagePath: "/images/Calculator.webp"
    },
    {
        name: "Scissors",
        category: "stationery",
        price: 60,
        stock: 70,
        description: "Sharp scissors for precise cutting",
        imagePath: "/images/Scissors.webp"
    },
    {
        name: "Whitener Pen",
        category: "stationery",
        price: 40,
        stock: 90,
        description: "Correction pen for fixing writing mistakes",
        imagePath: "/images/whitener.avif"
    },
    {
        name: "Fevistik Glue",
        category: "stationery",
        price: 10,
        stock: 120,
        description: "Easy-to-use glue stick for paper",
        imagePath: "/images/glue.avif"
    },
    {
        name: "Rubber Bands",
        category: "stationery",
        price: 40,
        stock: 200,
        description: "Pack of rubber bands for organizing papers",
        imagePath: "/images/rubber.avif"
    },
    {
        name: "Assignment A4 Sheets",
        category: "stationery",
        price: 80,
        stock: 300,
        description: "Pack of 100 A4 sheets for assignments",
        imagePath: "/images/paper.avif"
    },
    {
        name: "Punching Machine",
        category: "stationery",
        price: 120,
        stock: 40,
        description: "Hole puncher for documents",
        imagePath: "/images/punching.avif"
    },
    {
        name: "Stapler",
        category: "stationery",
        price: 200,
        stock: 60,
        description: "Heavy-duty stapler with staples included",
        imagePath: "/images/stapler.avif"
    },
    
    // Cold Drinks & Juice category
    {
        name: "Coca-Cola",
        category: "cold-drinks-juice",
        price: 40,
        stock: 100,
        description: "Refreshing Cola drink (330ml)",
        imagePath: "/images/cola.jpg"
    },
    {
        name: "Pepsi",
        category: "cold-drinks-juice",
        price: 40,
        stock: 100,
        description: "Classic Pepsi soft drink (330ml)",
        imagePath: "/images/pepsi.jpg"
    },
    {
        name: "Sprite",
        category: "cold-drinks-juice",
        price: 40,
        stock: 100,
        description: "Lemon-lime flavored soft drink (330ml)",
        imagePath: "/images/sprite.jpg"
    },
    {
        name: "Fanta",
        category: "cold-drinks-juice",
        price: 40,
        stock: 100,
        description: "Orange flavored soft drink (330ml)",
        imagePath: "/images/fanta.jpg"
    },
    {
        name: "Mango Juice",
        category: "cold-drinks-juice",
        price: 45,
        stock: 80,
        description: "Fresh mango juice (250ml)",
        imagePath: "/images/mango-juice.jpg"
    },
    {
        name: "Orange Juice",
        category: "cold-drinks-juice",
        price: 45,
        stock: 80,
        description: "Fresh orange juice (250ml)",
        imagePath: "/images/orange-juice.jpg"
    },
    {
        name: "Lemonade",
        category: "cold-drinks-juice",
        price: 35,
        stock: 70,
        description: "Refreshing lemonade (250ml)",
        imagePath: "/images/lemonade.jpg"
    },
    {
        name: "Iced Tea",
        category: "cold-drinks-juice",
        price: 45,
        stock: 60,
        description: "Chilled lemon iced tea (330ml)",
        imagePath: "/images/iced-tea.jpg"
    },
    
    // Breakfast & Instant Food
    {
        name: "Maggi Noodles",
        category: "breakfast-instant-food",
        price: 20,
        stock: 150,
        description: "Classic Maggi instant noodles (85g)",
        imagePath: "/images/maggi.jpg"
    },
    {
        name: "Bread Sandwich",
        category: "breakfast-instant-food",
        price: 60,
        stock: 40,
        description: "Freshly made vegetable sandwich",
        imagePath: "/images/sandwich.jpg"
    },
    {
        name: "Poha",
        category: "breakfast-instant-food",
        price: 50,
        stock: 30,
        description: "Traditional Indian breakfast dish made with flattened rice",
        imagePath: "/images/poha.jpg"
    },
    {
        name: "Upma",
        category: "breakfast-instant-food",
        price: 50,
        stock: 30,
        description: "South Indian breakfast dish made with semolina",
        imagePath: "/images/upma.jpg"
    },
    {
        name: "Oats",
        category: "breakfast-instant-food",
        price: 70,
        stock: 25,
        description: "Healthy oatmeal with fruits",
        imagePath: "/images/oats.jpg"
    },
    {
        name: "Cup Noodles",
        category: "breakfast-instant-food",
        price: 45,
        stock: 100,
        description: "Ready-to-eat cup noodles, just add hot water",
        imagePath: "/images/cup-noodles.jpg"
    },
    
    // Coffee & Tea
    {
        name: "Espresso Coffee",
        category: "coffee-tea",
        price: 50,
        stock: 100,
        description: "Strong single shot espresso coffee",
        imagePath: "/images/espresso.jpg"
    },
    {
        name: "Cappuccino",
        category: "coffee-tea",
        price: 70,
        stock: 100,
        description: "Classic cappuccino with frothy milk",
        imagePath: "/images/cappuccino.jpg"
    },
    {
        name: "Latte",
        category: "coffee-tea",
        price: 70,
        stock: 100,
        description: "Smooth coffee with steamed milk",
        imagePath: "/images/latte.jpg"
    },
    {
        name: "Masala Chai",
        category: "coffee-tea",
        price: 30,
        stock: 100,
        description: "Traditional Indian spiced tea",
        imagePath: "/images/masala-chai.jpg"
    },
    {
        name: "Green Tea",
        category: "coffee-tea",
        price: 40,
        stock: 80,
        description: "Healthy green tea with antioxidants",
        imagePath: "/images/green-tea.jpg"
    },
    {
        name: "Hot Chocolate",
        category: "coffee-tea",
        price: 60,
        stock: 70,
        description: "Rich and creamy hot chocolate drink",
        imagePath: "/images/hot-chocolate.jpg"
    },
    
    // Packed Food
    {
        name: "Lays Chips",
        category: "packed-food",
        price: 20,
        stock: 150,
        description: "Classic salted potato chips (40g)",
        imagePath: "/images/lays.jpg"
    },
    {
        name: "Kurkure",
        category: "packed-food",
        price: 20,
        stock: 150,
        description: "Spicy masala flavored snack (40g)",
        imagePath: "/images/kurkure.jpg"
    },
    {
        name: "Biscuits",
        category: "packed-food",
        price: 25,
        stock: 120,
        description: "Glucose biscuits pack (100g)",
        imagePath: "/images/biscuits.jpg"
    },
    {
        name: "Popcorn",
        category: "packed-food",
        price: 30,
        stock: 100,
        description: "Buttered popcorn pack (50g)",
        imagePath: "/images/popcorn.jpg"
    },
    {
        name: "Mixed Nuts",
        category: "packed-food",
        price: 80,
        stock: 60,
        description: "Healthy mix of assorted nuts (100g)",
        imagePath: "/images/mixed-nuts.jpg"
    },
    {
        name: "Protein Bar",
        category: "packed-food",
        price: 60,
        stock: 80,
        description: "Chocolate flavored protein bar (40g)",
        imagePath: "/images/protein-bar.jpg"
    },
    
    // Chocolates & Candy
    {
        name: "Dairy Milk",
        category: "chocolates-candy",
        price: 40,
        stock: 100,
        description: "Cadbury Dairy Milk chocolate bar (40g)",
        imagePath: "/images/dairy-milk.jpg"
    },
    {
        name: "KitKat",
        category: "chocolates-candy",
        price: 30,
        stock: 100,
        description: "Crispy wafer chocolate bar (35g)",
        imagePath: "/images/kitkat.jpg"
    },
    {
        name: "5 Star",
        category: "chocolates-candy",
        price: 25,
        stock: 100,
        description: "Chewy caramel chocolate bar (35g)",
        imagePath: "/images/5star.jpg"
    },
    {
        name: "Mints",
        category: "chocolates-candy",
        price: 20,
        stock: 120,
        description: "Refreshing mint candies (15g)",
        imagePath: "/images/mints.jpg"
    },
    {
        name: "Chewing Gum",
        category: "chocolates-candy",
        price: 15,
        stock: 150,
        description: "Long-lasting mint flavored gum (10 pieces)",
        imagePath: "/images/chewing-gum.jpg"
    },
    
    // Ice Cream
    {
        name: "Vanilla Ice Cream",
        category: "ice-cream",
        price: 50,
        stock: 40,
        description: "Classic vanilla ice cream cup (100ml)",
        imagePath: "/images/vanilla-ice-cream.jpg"
    },
    {
        name: "Chocolate Ice Cream",
        category: "ice-cream",
        price: 50,
        stock: 40,
        description: "Rich chocolate ice cream cup (100ml)",
        imagePath: "/images/chocolate-ice-cream.jpg"
    },
    {
        name: "Strawberry Ice Cream",
        category: "ice-cream",
        price: 50,
        stock: 40,
        description: "Sweet strawberry ice cream cup (100ml)",
        imagePath: "/images/strawberry-ice-cream.jpg"
    },
    {
        name: "Butterscotch Ice Cream",
        category: "ice-cream",
        price: 60,
        stock: 30,
        description: "Delicious butterscotch ice cream cup (100ml)",
        imagePath: "/images/butterscotch-ice-cream.jpg"
    },
    {
        name: "Ice Cream Cone",
        category: "ice-cream",
        price: 40,
        stock: 50,
        description: "Vanilla ice cream in a crispy cone",
        imagePath: "/images/ice-cream-cone.jpg"
    },
    
    // Printing & Xerox
    {
        name: "B&W Printing (per page)",
        category: "printing-xerox",
        price: 5,
        stock: 10000,
        description: "Black and white printing service, price per page",
        imagePath: "/images/bw-print.jpg"
    },
    {
        name: "Color Printing (per page)",
        category: "printing-xerox",
        price: 15,
        stock: 5000,
        description: "Color printing service, price per page",
        imagePath: "/images/color-print.jpg"
    },
    {
        name: "Document Scanning (per page)",
        category: "printing-xerox",
        price: 3,
        stock: 10000,
        description: "Document scanning service, price per page",
        imagePath: "/images/scanning.jpg"
    },
    {
        name: "Binding Service",
        category: "printing-xerox",
        price: 40,
        stock: 1000,
        description: "Spiral binding for documents",
        imagePath: "/images/binding.jpg"
    },
    {
        name: "Lamination (A4)",
        category: "printing-xerox",
        price: 30,
        stock: 1000,
        description: "Lamination service for A4 size documents",
        imagePath: "/images/lamination.jpg"
    }
];

// Insert products into database
const addProducts = async () => {
    await connectDB();
    
    try {
        // Delete existing products first
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        // Insert new products
        const result = await Product.insertMany(products);
        console.log(`Successfully added ${result.length} products`);
        
        // Log product counts by category
        const categories = [...new Set(products.map(p => p.category))];
        for (const category of categories) {
            const count = products.filter(p => p.category === category).length;
            console.log(`- ${category}: ${count} products`);
        }
        
    } catch (error) {
        console.error('Error adding products:', error);
    } finally {
        // Close connection
        mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the function
addProducts(); 