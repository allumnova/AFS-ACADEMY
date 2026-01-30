const { sequelize, User, Course } = require('../models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        // We do NOT force sync here to preserve existing data, 
        // but in a fresh seed we might want to check duplicates.
        // For this script, we'll check if admin exists first.

        const adminEmail = 'admin@afs.com';
        const facultyEmail = 'faculty@afs.com';
        const studentEmail = 'student@afs.com';
        const password = await bcrypt.hash('password123', 10);

        // 1. Create Users
        const admin = await User.findOrCreate({
            where: { email: adminEmail },
            defaults: {
                name: 'Super Admin',
                email: adminEmail,
                password: password,
                role: 'admin',
                phone: '9999999999'
            }
        });

        const faculty = await User.findOrCreate({
            where: { email: facultyEmail },
            defaults: {
                name: 'Dr. Expert Faculty',
                email: facultyEmail,
                password: password,
                role: 'faculty',
                phone: '8888888888'
            }
        });

        const student = await User.findOrCreate({
            where: { email: studentEmail },
            defaults: {
                name: 'John Student',
                email: studentEmail,
                password: password,
                role: 'student',
                phone: '7777777777'
            }
        });

        console.log('Users seeded/verified.');

        // 2. Create Courses (assigned to Faculty)
        const facultyId = faculty[0].id; // findOrCreate returns [instance, created]

        const courses = [
            {
                title: 'Complete Web Development Bootcamp',
                description: 'Learn HTML, CSS, JS, Node, and React from scratch.',
                price: 4999.00,
                category: 'Web Development',
                level: 'beginner',
                instructorId: facultyId,
                thumbnail: '/uploads/course1.jpg' // Placeholder
            },
            {
                title: 'Advanced Flutter for Mobile Apps',
                description: 'Build enterprise-grade iOS and Android apps.',
                price: 5999.00,
                category: 'Mobile Development',
                level: 'advanced',
                instructorId: facultyId,
                thumbnail: '/uploads/course2.jpg' // Placeholder
            },
            {
                title: 'Data Science Masterclass',
                description: 'Python, Pandas, Scikit-learn and Machine Learning.',
                price: 6999.00,
                category: 'Data Science',
                level: 'intermediate',
                instructorId: facultyId,
                thumbnail: '/uploads/course3.jpg' // Placeholder
            }
        ];

        for (const courseData of courses) {
            await Course.findOrCreate({
                where: { title: courseData.title },
                defaults: courseData
            });
        }

        console.log('Courses seeded.');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seedDatabase();
