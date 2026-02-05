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

const Quiz = require('./Quiz');
const QuizResult = require('./QuizResult');

// ... existing imports ...

// Associations

// ... existing associations ...

// User has many Attendances
User.hasMany(Attendance, { foreignKey: 'userId', as: 'attendanceRecords' });
Attendance.belongsTo(User, { foreignKey: 'userId', as: 'student' });

// Course has many Quizzes
Course.hasMany(Quiz, { foreignKey: 'courseId', as: 'quizzes' });
Quiz.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Quiz has many Results
Quiz.hasMany(QuizResult, { foreignKey: 'quizId', as: 'results' });
QuizResult.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

// User has many QuizResults
User.hasMany(QuizResult, { foreignKey: 'userId', as: 'quizResults' });
QuizResult.belongsTo(User, { foreignKey: 'userId', as: 'student' });

const Certificate = require('./Certificate');

// User has many Certificates
User.hasMany(Certificate, { foreignKey: 'UserId', as: 'certificates' });
Certificate.belongsTo(User, { foreignKey: 'UserId', as: 'student' });

// Course has many Certificates
Course.hasMany(Certificate, { foreignKey: 'CourseId', as: 'certificates' });
Certificate.belongsTo(Course, { foreignKey: 'CourseId', as: 'course' });

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
    Quiz,
    QuizResult,
    Certificate,
};

// ... existing Notification/Review associations ...

// Notification Associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

// Review Associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'student' });
Review.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Course.hasMany(Review, { foreignKey: 'courseId', as: 'reviews' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
