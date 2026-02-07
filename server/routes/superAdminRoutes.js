const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { protect, authorize, isSuperAdmin } = require('../middleware/authMiddleware');

// All routes require authentication and Super Admin flag
router.use(protect);

// System Settings (Authenticated users only, not necessarily Super Admin)
router.get('/public-settings', superAdminController.getPublicSettings);

// All routes below this require Super Admin
router.use(isSuperAdmin);

// Admin Management
router.get('/admins', superAdminController.getAdmins);
router.post('/admins', superAdminController.createAdmin);
router.patch('/admins/:id/toggle', superAdminController.toggleAdminStatus);

// System Settings
router.get('/settings', superAdminController.getSettings);
router.post('/settings', superAdminController.updateSettings);

// Audit Logs
router.get('/audit-logs', superAdminController.getAuditLogs);

module.exports = router;
