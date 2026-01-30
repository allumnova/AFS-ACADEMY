const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    lectureId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Lectures',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late'),
        defaultValue: 'present',
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: true,
});

module.exports = Attendance;
