const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const { sequelize } = require('./models'); // Import from models index to ensure associations are loaded

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
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

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync models (disable force in production)
        await sequelize.sync({ force: false });
        console.log('Database synced.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        require('fs').writeFileSync('startup_error.txt', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        process.exit(1);
    }
};

startServer();
