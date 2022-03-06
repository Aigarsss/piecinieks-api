const {gql} = require("apollo-server-express");

module.exports = gql`
    scalar DateTime

    type Question {
        id: ID!
        question: String!
        answer: String!
        acceptedAnswers: String
        airedAt: String
        author: User!
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    
    type User {
        id: ID!,
        username: String!
        email: String!
        avatar: String
        questions: [Question!]!
    }

    type Query {
        getQuestions: [Question!]!
        getQuestion(id: ID!): Question!
    }
    
    type Mutation {
        addQuestion(question: String!, answer: String!, acceptedAnswers: String!, airedAt: String): Question!
        updateQuestion(question: String!, answer: String!, acceptedAnswers: String!, airedAt: String!): Question!
        deleteQuestion(id: ID!): Boolean!
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String, password: String!): String!
    }
`;
