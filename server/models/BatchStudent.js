const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BatchStudent = sequelize.define('BatchStudent', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    batchId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Batches',
            key: 'id'
        }
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    joiningDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('active', 'dropped', 'completed'),
        defaultValue: 'active',
    }
}, {
    tableName: 'BatchStudents',
    freezeTableName: true,
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['batchId', 'studentId']
        }
    ]
});

module.exports = BatchStudent;
