const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
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
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Courses',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'expired', 'dropped'),
        defaultValue: 'active',
    },
    completionPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    tableName: 'Enrollments',
    freezeTableName: true,
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['courseId']
        },
        {
            fields: ['status']
        },
        {
            unique: true,
            fields: ['userId', 'courseId'] // Prevent double enrollment
        }
    ]
});

module.exports = Enrollment;
