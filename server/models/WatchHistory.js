const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WatchHistory = sequelize.define('WatchHistory', {
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
    progressSeconds: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    lastWatchedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'watchhistories',
    freezeTableName: true,
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'lectureId']
        }
    ]
});

module.exports = WatchHistory;
