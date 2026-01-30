const { Quiz, QuizResult, Course, Enrollment } = require('../models');

// Get Quizzes for a Course
exports.getCourseQuizzes = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            where: { userId: req.user.id, courseId, status: 'active' }
        });

        if (!enrollment && req.user.role !== 'admin' && req.user.role !== 'faculty') {
            return res.status(403).json({ message: 'Not enrolled in this course' });
        }

        const quizzes = await Quiz.findAll({
            where: { courseId },
            attributes: ['id', 'title', 'description', 'durationMinutes', 'passingScore']
        });

        res.json(quizzes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Single Quiz (Start Quiz)
exports.getQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findByPk(id);

        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        // Hide answers from client
        const questionsSanitized = quiz.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options
        }));

        res.json({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            durationMinutes: quiz.durationMinutes,
            questions: questionsSanitized
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Submit Quiz
exports.submitQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers } = req.body; // { 1: 'a', 2: 'b' }

        const quiz = await Quiz.findByPk(id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let correctCount = 0;
        const totalQuestions = quiz.questions.length;

        // Calculate score
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.answer) {
                correctCount++;
            }
        });

        const scorePercentage = (correctCount / totalQuestions) * 100;
        const status = scorePercentage >= quiz.passingScore ? 'pass' : 'fail';

        // Save Result
        const result = await QuizResult.create({
            userId: req.user.id,
            quizId: id,
            score: Math.round(scorePercentage),
            totalQuestions,
            correctAnswers: correctCount,
            status,
            answers
        });

        res.json({
            message: 'Quiz submitted',
            result: {
                score: result.score,
                status: result.status,
                correctCount,
                totalQuestions
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Quiz (Admin/Faculty)
exports.createQuiz = async (req, res) => {
    try {
        const { courseId, title, description, questions, passingScore, durationMinutes } = req.body;

        const quiz = await Quiz.create({
            courseId,
            title,
            description,
            questions, // Array of { id, question, options[], answer }
            passingScore,
            durationMinutes
        });

        res.status(201).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
