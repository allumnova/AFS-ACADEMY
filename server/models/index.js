const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Lecture = require('./Lecture');
const Payment = require('./Payment');
const Attendance = require('./Attendance');
const Media = require('./Media');
const Review = require('./Review');
const Notification = require('./Notification');

// Associations

// User has many Enrollments
User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'student' });

// User (Instructor) has many Courses
User.hasMany(Course, { foreignKey: 'instructorId', as: 'teachingCourses' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

// Course has many Enrollments
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'students' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Course has many Lectures
Course.hasMany(Lecture, { foreignKey: 'courseId', as: 'lectures' });
Lecture.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User has many Payments
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'student' });

// Course can have many Payments (Course fee)
Course.hasMany(Payment, { foreignKey: 'courseId', as: 'payments' });
Payment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Lecture has many Attendances
Lecture.hasMany(Attendance, { foreignKey: 'lectureId', as: 'attendees' });
Attendance.belongsTo(Lecture, { foreignKey: 'lectureId', as: 'lecture' });

// User has many Attendances
User.hasMany(Attendance, { foreignKey: 'userId', as: 'attendanceRecords' });
Attendance.belongsTo(User, { foreignKey: 'userId', as: 'student' });

module.exports = {
    sequelize,
    User,
    Course,
    Enrollment,
    Lecture,
    Payment,
    Attendance,
    Media,
    Review,
    Notification,
};

// Notification Associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// Review Associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'student' });
Review.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Course.hasMany(Review, { foreignKey: 'courseId', as: 'reviews' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
