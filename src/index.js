const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const port = process.env.PORT || 4000;

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

const placeholders = [
    {
        'id': '1',
        'question': 'What is your favorite color?',
        'answer': 'red',
        'accepted_answers': 'red, reds',
        'created_at': 'date',
        'aired_at': 'date'
    },
    {
        'id': '2',
        'question': 'What is your favorite color2?',
        'answer': 'red2',
        'accepted_answers': 'red, reds2',
        'created_at': 'date',
        'aired_at': 'date'
    },
    {
        'id': '3',
        'question': 'What is your favorite color3?',
        'answer': 'red3',
        'accepted_answers': 'red, reds3',
        'created_at': 'date',
        'aired_at': 'date'
    },
]

const resolvers = {
    Query: {
        getQuestions: () => placeholders,
        getQuestion: (parent, args) => {
            return placeholders.find((question) => question.id === args.id)
        }
    },
    Mutation: {
        addQuestion: (parent, args) => {
            const questionValue = {
                id: String(placeholders.length + 1),
                question: args.question,
                answer: 'test',
                accepted_answers: 'test',
                created_at: 'date',
                aired_at: 'date'
            }
            placeholders.push(questionValue);
            return questionValue;
        }
    }
}

const app = express();
const server = new ApolloServer({typeDefs, resolvers});
server.applyMiddleware({app, path: '/api'})

// app.get('/', (req, res) => res.send('Hello World'))

app.listen(port, () => console.log(`GraphQl Server running at localhost:${port}${server.graphqlPath}`))