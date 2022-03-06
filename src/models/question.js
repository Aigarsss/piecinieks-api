const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            require: true
        },
        answer: {
            type: String,
            require: true
        },
        acceptedAnswers: {
            type: String,
            require: true
        },
        airedAt: {
            type: String,
            require: false
        }
    },
    {
        timestamps: true
    }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;