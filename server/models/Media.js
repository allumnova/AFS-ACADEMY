const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Media = sequelize.define('Media', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('image', 'video'),
        defaultValue: 'image',
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING, // e.g., 'events', 'campus', 'workshop'
        defaultValue: 'general',
    },
    uploadedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = Media;
