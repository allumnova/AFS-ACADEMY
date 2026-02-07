const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const notificationController = require('../controllers/notificationController');

router.get(
    '/stats',
    protect,
    authorize('admin'),
    adminController.getDashboardStats
);

router.post(
    '/notifications/send',
    protect,
    authorize('admin'),
    notificationController.sendTargetedNotification
);

router.get(
    '/students',
    protect,
    authorize('admin'),
    adminController.getAllStudents
);

router.get(
    '/export/students',
    protect,
    authorize('admin'),
    adminController.exportStudents
);

router.get(
    '/export/revenue',
    protect,
    authorize('admin'),
    adminController.exportRevenue
);

router.get(
    '/revenue/courses',
    protect,
    authorize('admin'),
    adminController.getCourseRevenue
);

router.get(
    '/payments',
    protect,
    authorize('admin'),
    adminController.getAllPayments
);

router.post(
    '/payments/:id/refund',
    protect,
    authorize('admin'),
    adminController.processRefund
);

module.exports = router;
