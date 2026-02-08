const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define('Certificate', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    issueDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    certificateUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    uniqueId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    tableName: 'Certificates',
    freezeTableName: true,
    timestamps: true
});

module.exports = Certificate;
