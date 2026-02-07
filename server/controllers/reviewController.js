const { Review, User, Course } = require('../models');

exports.addReview = async (req, res) => {
    try {
        const { courseId, rating, comment } = req.body;

        // Check if user already reviewed this course
        const existing = await Review.findOne({ where: { userId: req.user.id, courseId } });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this course' });
        }

        const review = await Review.create({
            userId: req.user.id,
            courseId,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const reviews = await Review.findAll({
            where: { courseId, status: 'approved' },
            include: [{ model: User, as: 'student', attributes: ['name', 'avatar'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllReviewsAdmin = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Course, as: 'course', attributes: ['title'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        console.error("GET_ALL_REVIEWS_ADMIN_ERROR:", error);
        res.status(500).json({ message: 'Server error fetching reviews for moderation' });
    }
};

exports.updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const review = await Review.findByPk(id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        await review.update({ status });
        res.json(review);
    } catch (error) {
        console.error("UPDATE_REVIEW_STATUS_ERROR:", error);
        res.status(500).json({ message: 'Server error updating review status' });
    }
};

exports.deleteReview = async (req, res) => {
    // ... logic same but added for completeness if needed ...
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);

        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.destroy();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
