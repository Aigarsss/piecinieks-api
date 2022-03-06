const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers')

const PORT = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();
db.connect(DB_HOST);

const getUser = (token) => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            throw new Error('Session invalid');
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization;
        const user = getUser(token) || 'No authorization header';
        console.log(user)
        return { models, user }
    }
});
server.applyMiddleware({app, path: '/api'})

// app.get('/', (req, res) => res.send('Hello World'))

app.listen(PORT, () => console.log(`GraphQl Server running at localhost:${PORT}${server.graphqlPath}`))