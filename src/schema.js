const {gql} = require("apollo-server-express");

module.exports = gql`
    scalar DateTime

    type Question {
        id: ID!,
        question: String!,
        answer: String!,
        acceptedAnswers: String,
        airedAt: String,
        createdAt: DateTime!,
        updatedAt: DateTime!
    }

    type Query {
        getQuestions: [Question!]!,
        getQuestion(id: ID!): Question!
    }
    
    type Mutation {
        addQuestion(question: String!, answer: String!, acceptedAnswers: String!, airedAt: String): Question!
        updateQuestion(question: String!, answer: String!, acceptedAnswers: String!, airedAt: String!): Question!
        deleteQuestion(id: ID!): Boolean!
    }
`;
