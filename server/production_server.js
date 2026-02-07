const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const { sequelize } = require('./models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to AFS Academy API' });
});

app.use('/uploads', express.static('uploads'));

// Routes - Enabling only Auth first
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

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        // await sequelize.sync({ force: false });
        console.log('Database synced.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
