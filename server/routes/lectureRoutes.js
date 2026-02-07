const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');

router.get('/upcoming', protect, lectureController.getUpcomingLectures);

router.get('/course/:courseId', protect, lectureController.getLecturesByCourse);

router.post(
    '/',
    protect,
    authorize('admin', 'faculty'),
    upload.single('video'),
    lectureController.createLecture
);

router.put(
    '/:id',
    protect,
    authorize('admin', 'faculty'),
    upload.single('video'),
    lectureController.updateLecture
);

router.delete(
    '/:id',
    protect,
    authorize('admin', 'faculty'),
    lectureController.deleteLecture
);

router.post(
    '/:id/attendance-code',
    protect,
    authorize('admin', 'faculty'),
    lectureController.generateAttendanceCode
);

router.post(
    '/:id/verify-attendance',
    protect,
    authorize('student'),
    lectureController.verifyAttendanceCode
);

router.get(
    '/:id/progress',
    protect,
    authorize('student'),
    lectureController.getLectureProgress
);

module.exports = router;
