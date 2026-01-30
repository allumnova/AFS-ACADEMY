const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');

// Public Routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected Routes (Admin/Faculty)
router.post(
    '/',
    protect,
    authorize('admin', 'faculty'),
    upload.single('thumbnail'),
    courseController.createCourse
);

router.get(
    '/my/created',
    protect,
    authorize('admin', 'faculty'),
    courseController.getFacultyCourses
);

router.get(
    '/my/enrolled',
    protect,
    courseController.getEnrolledCourses
);

router.put(
    '/:id',
    protect,
    authorize('admin', 'faculty'),
    upload.single('thumbnail'),
    courseController.updateCourse
);

router.delete(
    '/:id',
    protect,
    authorize('admin', 'faculty'),
    courseController.deleteCourse
);

module.exports = router;
