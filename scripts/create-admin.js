import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import userModel from '../models/userModel.js';
import connectDB from '../config/mongodb.js';

// Function to create admin user
const createAdminUser = async () => {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to MongoDB');

        // Admin user details
        const adminUser = {
            name: 'Admin',
            email: 'admin@campuscart.com',
            password: 'admin123',  // This will be hashed
            role: 'admin',
            isAccountVerified: true
        };

        // Check if admin user already exists
        const existingAdmin = await userModel.findOne({ email: adminUser.email });
        
        if (existingAdmin) {
            console.log('Admin user already exists.');
            await mongoose.connection.close();
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminUser.password, salt);
        
        // Create new admin user
        const newAdmin = new userModel({
            name: adminUser.name,
            email: adminUser.email,
            password: hashedPassword,
            role: adminUser.role,
            isAccountVerified: adminUser.isAccountVerified
        });

        // Save admin user
        await newAdmin.save();
        console.log('Admin user created successfully!');
        console.log('Email:', adminUser.email);
        console.log('Password:', adminUser.password);
        console.log('Important: Please change this password after first login.');

        // Close connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');

    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

// Run the function
createAdminUser(); 