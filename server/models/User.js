const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'faculty', 'student'),
        defaultValue: 'student',
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otpExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['role']
        },
        {
            fields: ['email']
        }
    ]
});

module.exports = User;
