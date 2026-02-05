const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all attendance reports (Admin/Faculty)
router.get(
    '/',
    protect,
    authorize('admin', 'faculty'),
    attendanceController.getAllAttendance
);

// Post Attendance (Faculty only or System)
router.post(
    '/',
    protect,
    authorize('admin', 'faculty'),
    attendanceController.markAttendance
);

// Get Attendance for a lecture
router.get(
    '/lecture/:lectureId',
    protect,
    authorize('admin', 'faculty'),
    attendanceController.getLectureAttendance
);

router.post(
    '/auto',
    protect,
    authorize('student'),
    attendanceController.autoMarkAttendance
);

module.exports = router;
