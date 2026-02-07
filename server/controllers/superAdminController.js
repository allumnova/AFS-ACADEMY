const { User, SystemSetting, AuditLog, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

// Helper to log actions
const logAction = async (userId, action, target, details, req) => {
    try {
        await AuditLog.create({
            userId,
            action,
            target,
            ipAddress: req.ip || req.connection.remoteAddress,
            details
        });
    } catch (error) {
        console.error("AUDIT_LOG_ERROR:", error);
    }
};

// 1. Admin Management
exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.findAll({
            where: { role: 'admin' },
            attributes: ['id', 'name', 'email', 'isSuperAdmin', 'isActive', 'createdAt']
        });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch admins' });
    }
};

exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, isSuperAdmin } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            isSuperAdmin: !!isSuperAdmin,
            isVerified: true
        });

        await logAction(req.user.id, 'CREATE_ADMIN', `User: ${admin.id}`, { email: admin.email }, req);

        res.status(201).json({ message: 'Admin created successfully', admin: { id: admin.id, name, email } });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create admin' });
    }
};

exports.toggleAdminStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await User.findByPk(id);

        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        if (admin.id === req.user.id) return res.status(400).json({ message: 'Cannot deactivate yourself' });

        admin.isActive = !admin.isActive;
        await admin.save();

        await logAction(req.user.id, 'TOGGLE_ADMIN_STATUS', `User: ${admin.id}`, { active: admin.isActive }, req);

        res.json({ message: `Admin ${admin.isActive ? 'activated' : 'deactivated'}` });
    } catch (error) {
        res.status(500).json({ message: 'Action failed' });
    }
};

// 2. System Settings
exports.getSettings = async (req, res) => {
    try {
        const settings = await SystemSetting.findAll();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch settings' });
    }
};

exports.getPublicSettings = async (req, res) => {
    try {
        const settings = await SystemSetting.findAll({
            where: {
                key: ['SITE_NAME', 'LOGO_URL', 'SUPPORT_EMAIL']
            }
        });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch public settings' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { settings } = req.body; // Array of { key, value }

        for (const s of settings) {
            await SystemSetting.upsert({
                key: s.key,
                value: s.value
            });
        }

        await logAction(req.user.id, 'UPDATE_SETTINGS', 'System', { updatedKeys: settings.map(s => s.key) }, req);

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update settings' });
    }
};

// 3. Audit Logs
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch logs' });
    }
};
