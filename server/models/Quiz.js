const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Courses',
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    questions: {
        type: DataTypes.JSON,
        // Structure: [{ id: 1, question: "...", options: ["a", "b", "c", "d"], answer: "a" }]
        allowNull: false,
    },
    passingScore: {
        type: DataTypes.INTEGER,
        defaultValue: 60, // Percentage
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
    }
}, {
    tableName: 'quizzes',
    freezeTableName: true,
    timestamps: true,
});

module.exports = Quiz;
