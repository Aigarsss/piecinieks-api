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
        accepted_answers: {
            type: String,
            require: true
        },
        created_at: {
            type: String,
            require: true
        },
        aired_at: {
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