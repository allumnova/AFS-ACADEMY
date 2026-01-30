const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/course/:courseId', reviewController.getCourseReviews);
router.post('/', protect, reviewController.addReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
