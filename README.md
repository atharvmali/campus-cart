# Campus Cart

A full-featured e-commerce platform for campus needs with user authentication, product management, and order processing capabilities.

## Overview

Campus Cart is a web application designed to simplify shopping for students on campus. It provides a platform to browse, purchase, and manage orders for various campus-related products such as stationery, food items, beverages, and more.

## Features

- **User Authentication**
  - Registration with email verification
  - Login/Logout functionality
  - Password reset via email
  - Role-based access control (user, admin, superadmin)

- **Product Management**
  - Category-based product organization
  - Product details with images, descriptions, and pricing
  - Inventory management

- **Shopping Experience**
  - Shopping cart functionality
  - Order placement and tracking
  - Order history

- **Admin Dashboard**
  - Manage products (add, edit, delete)
  - Process orders
  - User management
  - Sales reporting

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, HTML, CSS, JavaScript
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens), Cookies
- **Email Service**: Nodemailer with Brevo SMTP

## Installation

1. Clone the repository
   ```
   git clone https://github.com/atharvmali/campus-cart.git
   cd campus-cart
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   SENDER_EMAIL=your_sender_email
   ```

4. Set up the database
   ```
   npm run create-admin   # Creates admin account
   npm run add-products   # Populates database with sample products
   ```

5. Start the server
   ```
   npm run server   # For development with nodemon
   npm start        # For production
   ```

## Project Structure

```
/auth
├── config/             # Database configuration
├── controllers/        # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
│   └── adminController.js
├── middleware/         # Custom middleware functions
├── models/             # MongoDB schemas
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
├── public/             # Static assets (CSS, JS, images)
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   └── adminRoutes.js
├── scripts/            # Utility scripts
│   ├── create-admin.js
│   └── add-products.js
├── views/              # EJS templates
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
├── package-lock.json   # Dependency tree
└── server.js           # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-account` - Verify user account
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `GET /api/products/category/:category` - Get products by category

### Orders
- `POST /api/order/create` - Create a new order
- `GET /api/order/history` - Get order history
- `GET /api/order/:id` - Get specific order details

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `POST /api/admin/products` - Add a new product
- `PUT /api/admin/products/:id` - Update a product
- `DELETE /api/admin/products/:id` - Delete a product

## Web Routes

- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset page
- `/dashboard` - User dashboard
- `/campus-cart` - Main shopping page
- `/campus-cart/category` - Category-specific product listings
- `/campus-cart/shopping-cart` - Shopping cart page
- `/campus-cart/my-orders` - Order history page
- `/admin/*` - Admin dashboard pages

## Utility Scripts

### Create Admin
Creates an admin user in the database:
```
npm run create-admin
```

### Add Products
Populates the database with sample products:
```
npm run add-products
```

## Future Enhancements

- Payment gateway integration
- Wishlist functionality
- Product reviews and ratings
- Advanced search and filters
- Mobile app development

## License

This project is licensed under the MIT License 