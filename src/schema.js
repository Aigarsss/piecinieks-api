const {gql} = require("apollo-server-express");

module.exports = gql`
    scalar DateTime

    type Question {
        id: ID!
        question: String!
        answer: String!
        acceptedAnswers: String!
        explanation: String
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
        admin: Boolean!
    }

    type Query {
        questions: [Question!]!
        question(id: ID!): Question!
        user(username: String!): User
        users: [User!]!
        me: User!
    }
    
    type Mutation {
        addQuestion(question: String!, answer: String!, acceptedAnswers: String!, explanation: String, airedAt: String): Question!
        updateQuestion(question: String!, answer: String!, acceptedAnswers: String!, airedAt: String!): Question!
        deleteQuestion(id: ID!): Boolean!
        signUp(username: String!, email: String!, password: String!, admin: Boolean): String!
        signIn(username: String, email: String, password: String!): String!
    }
`;
