const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');

module.exports = {
    addQuestion: async (parent, { question, answer, acceptedAnswers, airedAt }, { models }) => {
        return await models.Question.create(
            {
                question: question,
                answer: answer,
                acceptedAnswers: acceptedAnswers,
                airedAt: airedAt
            }
        );
    },
    deleteQuestion: async (parent, { id }, { models }) => {
        try {
            await models.Question.findOneAndRemove({ _id: id })
            return true;
        } catch (err) {
            return false;
        }
    },
    updateQuestion: async (parent, { question, answer, acceptedAnswers, airedAt, id }, { models }) => {
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