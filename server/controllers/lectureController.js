const { Lecture, Course } = require('../models');

exports.createLecture = async (req, res) => {
    try {
        const { courseId, title, description, isLive, startTime, durationMinutes } = req.body;

        // Verify course existence and ownership
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to add lectures to this course' });
        }

        const videoUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const lecture = await Lecture.create({
            courseId,
            title,
            description,
            isLive: isLive === 'true' || isLive === true,
            startTime,
            durationMinutes,
            videoUrl
        });

        res.status(201).json(lecture);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getLecturesByCourse = async (req, res) => {
    try {
        const lectures = await Lecture.findAll({
            where: { courseId: req.params.courseId },
            order: [['createdAt', 'ASC']]
        });
        res.json(lectures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findByPk(req.params.id, {
            include: [{ model: Course, as: 'course' }]
        });

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        if (lecture.course.instructorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this lecture' });
        }

        const { title, description, isLive, startTime, durationMinutes } = req.body;

        if (title) lecture.title = title;
        if (description) lecture.description = description;
        if (isLive !== undefined) lecture.isLive = isLive === 'true' || isLive === true;
        if (startTime) lecture.startTime = startTime;
        if (durationMinutes) lecture.durationMinutes = durationMinutes;

        if (req.file) {
            lecture.videoUrl = `/uploads/${req.file.filename}`;
        }

        await lecture.save();
        res.json(lecture);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findByPk(req.params.id, {
            include: [{ model: Course, as: 'course' }]
        });

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        if (lecture.course.instructorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this lecture' });
        }

        await lecture.destroy();
        res.json({ message: 'Lecture removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.generateAttendanceCode = async (req, res) => {
    try {
        const { id } = req.params;
        const lecture = await Lecture.findByPk(id, {
            include: [{ model: Course, as: 'course' }]
        });

        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        // Check ownership
        if (lecture.course.instructorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        lecture.attendanceCode = code;
        await lecture.save();

        res.json({ code });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyAttendanceCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { code } = req.body;
        const { Attendance } = require('../models');

        const lecture = await Lecture.findByPk(id);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        if (!lecture.attendanceCode || lecture.attendanceCode !== code) {
            return res.status(400).json({ message: 'Invalid or expired attendance code' });
        }

        // Check if already marked
        const existing = await Attendance.findOne({ where: { lectureId: id, userId: req.user.id } });
        if (existing) {
            return res.status(400).json({ message: 'Attendance already marked' });
        }

        await Attendance.create({
            lectureId: id,
            userId: req.user.id,
            status: 'present'
        });

        res.json({ message: 'Attendance marked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLectureProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const watchHistory = await require('../models').WatchHistory.findOne({
            where: { userId, lectureId: id }
        });

        if (!watchHistory) {
            return res.json({ progressSeconds: 0, isCompleted: false });
        }

        res.json({
            progressSeconds: watchHistory.progressSeconds,
            isCompleted: watchHistory.isCompleted,
            lastWatchedAt: watchHistory.lastWatchedAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUpcomingLectures = async (req, res) => {
    try {
        const { Enrollment, Course } = require('../models');
        const { Op } = require('sequelize');

        // 1. Get courses user is enrolled in
        const enrollments = await Enrollment.findAll({
            where: { userId: req.user.id },
            attributes: ['courseId']
        });
        const courseIds = enrollments.map(e => e.courseId);

        if (courseIds.length === 0) return res.json([]);

        // 2. Get upcoming live lectures for these courses
        const lectures = await Lecture.findAll({
            where: {
                courseId: courseIds,
                isLive: true,
                startTime: { [Op.gt]: new Date() }
            },
            include: [{ model: Course, as: 'course', attributes: ['title'] }],
            order: [['startTime', 'ASC']],
            limit: 5
        });

        res.json(lectures);
    } catch (error) {
        console.error("GET_UPCOMING_LECTURES_ERROR:", error);
        res.status(500).json({ message: 'Server error fetching upcoming sessions' });
    }
};
