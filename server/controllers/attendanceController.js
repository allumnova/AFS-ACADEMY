const { Attendance, Lecture, User } = require('../models');

exports.markAttendance = async (req, res) => {
    try {
        const { lectureId, userId, status } = req.body;

        // Check if attendance already marked
        const existing = await Attendance.findOne({ where: { lectureId, userId } });
        if (existing) {
            return res.status(400).json({ message: 'Attendance already marked' });
        }

        const attendance = await Attendance.create({
            lectureId,
            userId,
            status: status || 'present'
        });

        res.status(201).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLectureAttendance = async (req, res) => {
    try {
        const { lectureId } = req.params;

        const attendance = await Attendance.findAll({
            where: { lectureId },
            include: [
                { model: User, as: 'student', attributes: ['id', 'name', 'email'] }
            ]
        });

        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findAll({
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Lecture, as: 'lecture', attributes: ['title'] }
            ],
            order: [['date', 'DESC']]
        });
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }


    exports.autoMarkAttendance = async (req, res) => {
        try {
            const { lectureId } = req.body;
            const userId = req.user.id;

            const lecture = await Lecture.findByPk(lectureId);
            if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

            if (!lecture.isLive) return res.status(400).json({ message: 'Lecture is not live' });

            // Check/Create Attendance
            const [attendance] = await Attendance.findOrCreate({
                where: { lectureId, userId },
                defaults: { status: 'present' }
            });

            res.json({ message: 'Auto attendance marked', attendance });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    };
