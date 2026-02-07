const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
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
    action: {
        type: DataTypes.STRING, // e.g., 'DELETE_USER', 'UPDATE_SETTINGS'
        allowNull: false,
    },
    target: {
        type: DataTypes.STRING, // e.g., 'User: UUID', 'Settings: SITE_NAME'
        allowNull: true,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    details: {
        type: DataTypes.JSON, // For storing old/new values or extra context
        allowNull: true,
    }
}, {
    tableName: 'audit_logs',
    freezeTableName: true,
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['action']
        }
    ]
});

module.exports = AuditLog;
