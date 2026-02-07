const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
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
        allowNull: true, // Could be null if it's a general subscription (future proof)
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR',
    },
    cfOrderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Cashfree Order ID must be unique
    },
    cfPaymentId: {
        type: DataTypes.STRING,
        allowNull: true, // Populated after successful payment
    },
    paymentSessionId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    paymentMethod: {
        type: DataTypes.STRING, // e.g., 'razorpay', 'stripe', 'upi', 'cashfree'
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
    },
    paymentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'payments',
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
            fields: ['cfOrderId']
        }
    ]
});

module.exports = Payment;
