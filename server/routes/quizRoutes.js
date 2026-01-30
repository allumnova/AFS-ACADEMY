const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'faculty'), quizController.createQuiz);
router.get('/course/:courseId', protect, quizController.getCourseQuizzes);
router.get('/:id', protect, quizController.getQuiz);
router.post('/:id/submit', protect, quizController.submitQuiz);

module.exports = router;
