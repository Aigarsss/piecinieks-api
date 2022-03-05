const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
require('dotenv').config();
const db = require('./db');
const models = require('./models');

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const typeDefs = gql`
    type Question {
        id: ID!,
        question: String!,
        answer: String!,
        accepted_answers: String!,
        created_at: String,
        aired_at: String
    }

    type Query {
        getQuestions: [Question!]!,
        getQuestion(id: ID!): Question!
    }
    
    type Mutation {
        addQuestion(question: String!): Question!
    }
`;

const resolvers = {
    Query: {
        getQuestions: async () => models.Question.find(),
        getQuestion: async (parent, args) => {
            return models.Question.findById(args.id);
        }
    },
    Mutation: {
        addQuestion: async (parent, args) => {
            return await models.Question.create(
                {
                    question: args.question,
                    answer: 'test',
                    accepted_answers: 'test',
                    created_at: 'date',
                    aired_at: 'date'
                }
            );
        }
    }
}

const app = express();
db.connect(DB_HOST);
const server = new ApolloServer({typeDefs, resolvers});
server.applyMiddleware({app, path: '/api'})

// app.get('/', (req, res) => res.send('Hello World'))

app.listen(port, () => console.log(`GraphQl Server running at localhost:${port}${server.graphqlPath}`))