const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const { sequelize } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5555', 'http://localhost:3000', 'https://allumnova.cloud'],
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to AFS Academy API' });
});

// Serve uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lectures', require('./routes/lectureRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/batches', require('./routes/batchRoutes'));
app.use('/api/super-admin', require('./routes/superAdminRoutes'));

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models (disable force in production)
        // await sequelize.sync({ alter: true });
        // console.log('Database synced.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('CRITICAL: Unable to connect to the database or sync failed:', error);
        if (error.sql) {
            console.error('Failed SQL:', error.sql);
        }
        require('fs').writeFileSync('startup_error.txt', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        process.exit(1);
    }
};

startServer();
