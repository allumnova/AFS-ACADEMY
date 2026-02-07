const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lecture = sequelize.define('Lecture', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Courses',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true, // Can be null if it's a future live session
    },
    isLive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    resources: {
        type: DataTypes.JSON, // Array of file URLs
        allowNull: true,
    },
    attendanceCode: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'lectures',
    freezeTableName: true,
    timestamps: true,
});

module.exports = Lecture;
