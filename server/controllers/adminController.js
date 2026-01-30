const { User, Course, Payment, Enrollment } = require('../models');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStudents = await User.count({ where: { role: 'student' } });
        const totalFaculty = await User.count({ where: { role: 'faculty' } });
        const totalCourses = await Course.count();
        const totalEnrollments = await Enrollment.count();

        // Aggregations
        const payments = await Payment.findAll();
        const totalRevenue = payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

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
                total: totalEnrollments
            },
            revenue: {
                total: totalRevenue,
                currency: 'INR'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
