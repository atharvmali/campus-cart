import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js'


export const register = async (req, res) => {

    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: 'Missing Details'})
    }

    try {

        const existingUser = await userModel.findOne({email})

        if(existingUser) {
            return res.json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name, 
            email, 
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({
            id: user._id,
            name: user.name
        }, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Sending welcome email
        const welcomeTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Campus Cart! 🎉</h1>
                </div>
                <div class="content">
                    <h2>Hello ${name},</h2>
                    <p>Thank you for joining Campus Cart! We're excited to have you as part of our community.</p>
                    <p>Your account has been successfully created with the email: <strong>${email}</strong></p>
                    <p>With Campus Cart, you can:</p>
                    <ul>
                        <li>Browse and purchase items from college shops</li>
                        <li>Print your documents</li>
                        <li>Connect with your campus community</li>
                    </ul>
                </div>
                <div class="footer">
                    <p>© 2025 Campus Cart. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Campus Cart! 🎉',
            html: welcomeTemplate
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true});

    } catch(error) {
        res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.json({success: false, message: 'Email and password are required'})
    }

    try {

        const user = await userModel.findOne({email});

        if(!user) {
            return res.json({success: false, message: 'Invalid email'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.json({success: false, message: 'Invalid password'})
        }

        const token = jwt.sign({
            id: user._id,
            name: user.name
        }, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true});

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success: true, message: "Logged Out"})


    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
    try {

        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified) {
            return res.json({success: false, message: "Account Already Verified"});
        }

        const otp = String( Math.floor( 100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const verificationTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                .otp-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #4f46e5; }
                .note { font-size: 14px; color: #6b7280; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verify Your Email</h1>
                </div>
                <div class="content">
                    <h2>Account Verification OTP</h2>
                    <p>Please use the following OTP to verify your Campus Cart account:</p>
                    <div class="otp-box">
                        ${otp}
                    </div>
                    <p class="note">This OTP will expire in 24 hours.</p>
                </div>
                <div class="footer">
                    <p>© 2025 Campus Cart. All rights reserved.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>`;

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Campus Cart Account 🔐',
            html: verificationTemplate
        }

        await transporter.sendMail(mailOption);

        return res.json({success: true, message: "Verification OTP Sent on Email"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// Verify the email using OTP
export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp) {
        return res.json({success: false, message: "Missing Details"});
    }

    try {
        const user = await userModel.findById(userId);

        if(!user) {
            return res.json({success: false, message: "User Not Found"});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success: false, message: "Invalid OTP"});
        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OPT Expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({success: true, message: "Email Verified Successfully"});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// Check if usre is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// Send Password reset OTP
export const sendResetOtp = async (req, res) => {
    const {email} = req.body;

    if(!email) {
        return res.json({success: false, message: "Email is Required"});
    }

    try {

        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User Not Found"});
        }

        const otp = String(Math.floor(100000+Math.random()*900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
                .otp-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #4f46e5; }
                .warning { color: #dc2626; font-size: 14px; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Password Reset OTP</h2>
                    <p>You've requested to reset your password. Use this OTP to proceed:</p>
                    <div class="otp-box">
                        ${otp}
                    </div>
                    <p class="warning">This OTP will expire in 15 minutes.</p>
                    <p>If you didn't request a password reset, please secure your account immediately.</p>
                </div>
                <div class="footer">
                    <p>© 2025 Campus Cart. All rights reserved.</p>
                    <p>For security reasons, please never share this OTP with anyone.</p>
                </div>
            </div>
        </body>
        </html>`;

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Request - Campus Cart 🔑',
            html: resetTemplate
        };

        await transporter.sendMail(mailOption);
        

        return res.json({success: true, message:'OTP sent to your email'});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if(!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP, and new password are required"});
    }

    try {
        
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User Not Found"});
        }

        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({success: false, message: "Invalid OTP"});
        }

        if(user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OPT Expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message:'Password has been reset successfully'});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}