const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SystemSetting = sequelize.define('SystemSetting', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING, // branding, payment, general
        defaultValue: 'general',
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'system_settings',
    freezeTableName: true,
    timestamps: true,
});

module.exports = SystemSetting;
