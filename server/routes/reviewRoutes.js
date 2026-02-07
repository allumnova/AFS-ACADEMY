const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/course/:courseId', reviewController.getCourseReviews);
router.post('/', protect, reviewController.addReview);
router.delete('/:id', protect, reviewController.deleteReview);

// Moderation routes (Admin only)
router.get('/admin/all', protect, authorize('admin', 'super-admin'), reviewController.getAllReviewsAdmin);
router.patch('/:id/status', protect, authorize('admin', 'super-admin'), reviewController.updateReviewStatus);

module.exports = router;
