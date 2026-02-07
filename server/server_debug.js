const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

console.log("Debug script starting...");

// Hardcode env vars
process.env.PORT = 5000;
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASS = '';
process.env.DB_NAME = 'afs_academy_db';
process.env.JWT_SECRET = 'supersecretkey_change_this';
process.env.NODE_ENV = 'development';

try {
    const { sequelize } = require('./models');
    console.log("Models loaded.");

    const app = express();
    const PORT = process.env.PORT || 5000;

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(morgan('dev'));

    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to AFS Academy API' });
    });

    // Minimal routes just to test
    app.use('/api/auth', require('./routes/authRoutes'));

    const startServer = async () => {
        try {
            await sequelize.authenticate();
            console.log('Database connected successfully.');
            // await sequelize.sync({ force: false }); 
            // Skipping sync to avoid issues for now, just restart

            app.listen(PORT, () => {
                console.log(`Debug Server is running on port ${PORT}`);
            });
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    };

    startServer();

} catch (e) {
    console.error("Error loading models or starting server:", e);
}
