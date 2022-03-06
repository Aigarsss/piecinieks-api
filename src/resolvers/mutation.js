const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');

module.exports = {
    addQuestion: async (parent, { question, answer, acceptedAnswers, airedAt }, { models, user }) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to add questions')
        }

        return await models.Question.create(
            {
                question: question,
                answer: answer,
                acceptedAnswers: acceptedAnswers,
                airedAt: airedAt,
                author: mongoose.Types.ObjectId(user.id)
            }
        );
    },
    deleteQuestion: async (parent, { id }, { models, user }) => {

        if (!user) {
            throw new AuthenticationError('You must be signed in to delete a question')
        }

        const question = models.Question.findById(id);

        if (question && String(question.author) !== user.id) {
            throw new ForbiddenError("You don't have permissions to delete the question");
        }

        try {
            await models.Question.findOneAndRemove({ _id: id })
            return true;
        } catch (err) {
            return false;
        }
    },
    updateQuestion: async (parent, { question, answer, acceptedAnswers, airedAt, id }, { models, user }) => {
        if (!user) {
            throw new AuthenticationError('You must be signed in to edit a question')
        }

        const originalQuestion = models.Question.findById(id);

        if (originalQuestion && String(originalQuestion.author) !== user.id) {
            throw new ForbiddenError("You don't have permissions to edit the question");
        }

        return await models.Question.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    question,
                    answer,
                    acceptedAnswers,
                    airedAt
                }
            },
            {
                new: true
            }
        )
    },
    signUp: async (parent, { username, email, password }, { models }) => {
        email = email.trim().toLowerCase();
        const hashed = await bcrypt.hash(password, 10);
        const avatar = gravatar(email);

        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            })

            return jwt.sign({ id: user._id}, process.env.JWT_SECRET)
        } catch (err) {
            console.log(err);
            throw new Error('Error creating account')
        }
    },
    signIn: async (parent, {username, email, password}, { models }) => {
        try {
            if (email) {
                email = email.trim().toLowerCase();
            }

            const user = await models.User.findOne({
                $or: [{ email }, { username }]
            })

            if (!user) {
                throw new AuthenticationError('Error signing in');
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new AuthenticationError('Error signing in');
            }

            return jwt.sign({ id: user._id}, process.env.JWT_SECRET)

        } catch (err) {
            console.log(err);
            throw new AuthenticationError('Error signing in');
        }
    }
}