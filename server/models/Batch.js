const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Batch = sequelize.define('Batch', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Courses',
            key: 'id'
        }
    },
    instructorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    days: {
        type: DataTypes.JSON, // e.g., ["Monday", "Wednesday", "Friday"]
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('upcoming', 'active', 'completed', 'cancelled'),
        defaultValue: 'upcoming',
    },
    maxCapacity: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
    }
}, {
    tableName: 'Batches',
    freezeTableName: true,
    timestamps: true,
});

module.exports = Batch;
