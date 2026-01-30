const { Review, User } = require('../models');

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
            where: { courseId },
            include: [{ model: User, as: 'student', attributes: ['name'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByPk(id);

        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Only student who wrote it or admin can delete
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await review.destroy();
        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
