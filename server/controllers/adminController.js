const { User, Course, Payment, Enrollment, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStudents = await User.count({ where: { role: 'student' } });
        const totalFaculty = await User.count({ where: { role: 'faculty' } });
        const totalCourses = await Course.count();
        const totalEnrollments = await Enrollment.count();

        // Aggregations
        const payments = await Payment.findAll({ where: { status: 'completed' } });
        const totalRevenue = payments.reduce((acc, curr) => {
            const val = parseFloat(curr.amount);
            return acc + (isNaN(val) ? 0 : val);
        }, 0);

        // Recent Enrollments (Last 5)
        const recentEnrollments = await Enrollment.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Course, as: 'course', attributes: ['title', 'price'] }
            ]
        });

        res.json({
            users: {
                total: totalUsers,
                students: totalStudents,
                faculty: totalFaculty
            },
            courses: {
                total: totalCourses
            },
            enrollments: {
                total: totalEnrollments,
                recent: recentEnrollments
            },
            revenue: {
                total: totalRevenue,
                currency: 'INR'
            }
        });
    } catch (error) {
        console.error("ADMIN_STATS_ERROR:", error);
        res.status(500).json({
            message: 'Server error fetching dashboard stats',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.findAll({
            where: { role: 'student' },
            attributes: ['id', 'name', 'email', 'createdAt', 'isActive', 'avatar'],
            include: [{
                model: Enrollment,
                as: 'enrollments',
                attributes: ['status', 'createdAt']
            }],
            order: [['createdAt', 'DESC']]
        });

        // Format data for the frontend
        const formattedStudents = students.map(student => {
            const activeCourses = student.enrollments.filter(e => e.status === 'active').length;
            const completedCourses = student.enrollments.filter(e => e.status === 'completed').length;

            return {
                id: student.id,
                name: student.name,
                email: student.email,
                joined: student.createdAt,
                status: student.isActive ? 'Active' : 'Inactive',
                courses: student.enrollments.length,
                activeCourses,
                completedCourses,
                avatar: student.avatar
            };
        });

        res.json(formattedStudents);
    } catch (error) {
        console.error("GET_STUDENTS_ERROR:", error);
        res.status(500).json({ message: "Failed to fetch students", error: error.message });
    }
};
exports.exportStudents = async (req, res) => {
    try {
        const students = await User.findAll({
            where: { role: 'student' },
            attributes: ['name', 'email', 'createdAt', 'isActive']
        });

        let csv = 'Name,Email,Joined Date,Status\n';
        students.forEach(student => {
            csv += `"${student.name}","${student.email}","${student.createdAt}","${student.isActive ? 'Active' : 'Inactive'}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
        res.status(200).send(csv);
    } catch (error) {
        console.error("EXPORT_STUDENTS_ERROR:", error);
        res.status(500).json({ message: "Export failed", error: error.message });
    }
};

exports.exportRevenue = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            where: { status: 'completed' },
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Course, as: 'course', attributes: ['title'] }
            ]
        });

        let csv = 'Date,Student Name,Email,Course,Amount,TransactionID\n';
        payments.forEach(p => {
            csv += `"${p.createdAt}","${p.student?.name}","${p.student?.email}","${p.course?.title}","${p.amount}","${p.transactionId}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=revenue.csv');
        res.status(200).send(csv);
    } catch (error) {
        console.error("EXPORT_REVENUE_ERROR:", error);
        res.status(500).json({ message: "Export failed", error: error.message });
    }
};

exports.getCourseRevenue = async (req, res) => {
    try {
        const revenueData = await Payment.findAll({
            where: { status: 'completed' },
            attributes: [
                'courseId',
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalRevenue'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalSales']
            ],
            include: [{
                model: Course,
                as: 'course',
                attributes: ['title', 'price']
            }],
            group: ['courseId', 'course.id', 'course.title', 'course.price'],
            order: [[sequelize.literal('totalRevenue'), 'DESC']]
        });

        res.json(revenueData);
    } catch (error) {
        console.error("GET_COURSE_REVENUE_ERROR:", error);
        res.status(500).json({ message: "Failed to fetch revenue data", error: error.message });
    }
};

exports.processRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);

        if (!payment) return res.status(404).json({ message: "Payment not found" });
        if (payment.status === 'refunded') return res.status(400).json({ message: "Payment already refunded" });

        // Update payment status
        payment.status = 'refunded';
        await payment.save();

        // Expire enrollment if it exists
        await Enrollment.update(
            { status: 'expired' },
            { where: { userId: payment.userId, courseId: payment.courseId } }
        );

        res.json({ message: "Refund processed successfully and enrollment expired." });
    } catch (error) {
        console.error("PROCESS_REFUND_ERROR:", error);
        res.status(500).json({ message: "Refund processing failed", error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [
                { model: User, as: 'student', attributes: ['name', 'email'] },
                { model: Course, as: 'course', attributes: ['title'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        console.error("GET_ALL_PAYMENTS_ERROR:", error);
        res.status(500).json({ message: "Failed to fetch payments", error: error.message });
    }
};
