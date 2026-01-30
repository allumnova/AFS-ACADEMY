const { User } = require('../models');
const sendEmail = require('../utils/emailService');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.sendOTP = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your AFS Academy Verification Code',
                message: `Your verification code is ${otp}. It will expire in 10 minutes.`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">Verify Your Account</h2>
                        <p>Hello ${user.name},</p>
                        <p>Your verification code for AFS Academy is:</p>
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111; margin: 20px 0;">${otp}</div>
                        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #999;">If you didn't request this, please ignore this email.</p>
                    </div>
                `
            });
            res.json({ message: 'Verification code sent to your email' });
        } catch (mailError) {
            console.error('Mail Error:', mailError);
            res.status(500).json({ message: 'Error sending email. Please try again later.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: 'Account verified successfully', isVerified: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.avatar = avatar || user.avatar;

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
