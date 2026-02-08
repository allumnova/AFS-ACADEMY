const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizResult = sequelize.define('QuizResult', {
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
    quizId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Quizzes',
            key: 'id'
        }
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    correctAnswers: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pass', 'fail'),
        allowNull: false,
    },
    answers: {
        type: DataTypes.JSON, // Store user's answers for review
        allowNull: true,
    }
}, {
    tableName: 'QuizResults',
    freezeTableName: true,
    timestamps: true,
});

module.exports = QuizResult;
