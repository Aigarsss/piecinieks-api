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
        explanation: {
            type: String,
            require: false
        },
        airedAt: {
            type: String,
            require: false
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;