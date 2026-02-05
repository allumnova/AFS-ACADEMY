const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'student',
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// ... (existing helper methods if any)

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate user payload
        const payload = {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email
        };

        // Sign Token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const smsService = require('../services/smsService');

exports.sendOtp = async (req, res) => {
    try {
        const { phone, email } = req.body;
        const identifier = email || phone;

        if (!identifier) {
            return res.status(400).json({ message: 'Email or Phone is required' });
        }

        // Find user
        // Note: This implementation assumes user exists. 
        // For registration flow, you might want to create a temp user or handle differently.
        const user = await User.findOne({
            where: email ? { email } : { phone }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send OTP
        // Priority to Phone SMS if available, else Email (mock for now for email)
        if (phone) {
            await smsService.sendOTP(phone, otp);
        } else {
            // console.log(`[Mock Email] Sending OTP to ${email}: ${otp}`);
        }

        res.json({ message: 'OTP sent successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phone, email, otp } = req.body;

        const user = await User.findOne({
            where: email ? { email } : { phone }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check OTP
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check Expiry
        if (user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP Expired' });
        }

        // Clear OTP
        user.otp = null;
        user.otpExpires = null;
        user.isVerified = true;
        await user.save();

        // Generate Token (Login User)
        const payload = {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'OTP Verified & Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
