const { Course, User, Enrollment } = require('../models');

exports.createCourse = async (req, res) => {
    try {
        const { title, description, price, category, level } = req.body;

        // Thumbnail from file upload
        const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;

        const course = await Course.create({
            title,
            description,
            price,
            category,
            level,
            thumbnail,
            instructorId: req.user.id, // From authMiddleware
        });

        res.status(201).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const whereClause = {};
        if (req.query.instructorId) {
            whereClause.instructorId = req.query.instructorId;
        }

        const courses = await Course.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'instructor', attributes: ['id', 'name'] }
            ],
        });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFacultyCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            where: { instructorId: req.user.id },
            include: [
                { model: User, as: 'instructor', attributes: ['id', 'name'] }
            ],
        });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [
                { model: User, as: 'instructor', attributes: ['id', 'name'] },
                { model: require('../models').Lecture, as: 'lectures' }
            ],
            order: [[{ model: require('../models').Lecture, as: 'lectures' }, 'createdAt', 'ASC']]
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        let courseData = course.toJSON();

        // If user is logged in, attach progress
        if (req.user) {
            const lectureIds = courseData.lectures.map(l => l.id);
            const history = await require('../models').WatchHistory.findAll({
                where: {
                    userId: req.user.id,
                    lectureId: lectureIds
                }
            });

            // Create a map for faster lookup
            const historyMap = {};
            history.forEach(h => {
                historyMap[h.lectureId] = h;
            });

            courseData.lectures = courseData.lectures.map(lecture => ({
                ...lecture,
                isCompleted: historyMap[lecture.id] ? historyMap[lecture.id].isCompleted : false,
                progressSeconds: historyMap[lecture.id] ? historyMap[lecture.id].progressSeconds : 0
            }));
        }

        res.json(courseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Course,
                    as: 'course',
                    include: [
                        { model: User, as: 'instructor', attributes: ['id', 'name'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Flatten data structure to return courses directly, with enrollment metadata if needed
        const courses = enrollments.map(enrollment => {
            const course = enrollment.course.toJSON();
            course.enrollmentStatus = enrollment.status;
            course.completionPercentage = enrollment.completionPercentage;
            return course;
        });

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check ownership
        if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        const { title, description, price, category, level } = req.body;

        // Update fields
        if (title) course.title = title;
        if (description) course.description = description;
        if (price) course.price = price;
        if (category) course.category = category;
        if (level) course.level = level;
        if (req.file) {
            course.thumbnail = `/uploads/${req.file.filename}`;
        }

        await course.save();
        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check ownership
        if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        await course.destroy();
        res.json({ message: 'Course removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { courseId, lectureId, progressSeconds, isCompleted } = req.body;
        const userId = req.user.id;

        // 1. Update/Create WatchHistory
        const [watchHistory, created] = await require('../models').WatchHistory.findOrCreate({
            where: { userId, lectureId },
            defaults: { progressSeconds, isCompleted }
        });

        if (!created) {
            watchHistory.progressSeconds = progressSeconds;
            if (isCompleted) watchHistory.isCompleted = true;
            watchHistory.lastWatchedAt = new Date();
            await watchHistory.save();
        }

        // 2. Update Enrollment Completion %
        // Get all lectures for this course
        const allLectures = await require('../models').Lecture.findAll({ where: { courseId }, attributes: ['id'] });
        const totalLectures = allLectures.length;

        if (totalLectures > 0) {
            // Get count of completed lectures for this user in this course
            const completedCount = await require('../models').WatchHistory.count({
                where: {
                    userId,
                    lectureId: allLectures.map(l => l.id),
                    isCompleted: true
                }
            });

            const percentage = Math.round((completedCount / totalLectures) * 100);

            // Update Enrollment
            await Enrollment.update(
                { completionPercentage: percentage, status: percentage === 100 ? 'completed' : 'active' },
                { where: { userId, courseId } }
            );
        }

        res.json({ message: 'Progress updated' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
