const Query = require('./query');
const Mutation = require('./mutation');
const {GraphQLDateTime} = require("graphql-iso-date");
Question = require('./question');
User = require('./user');

module.exports = {
    Query,
    Mutation,
    Question,
    User,
    DateTime: GraphQLDateTime
}