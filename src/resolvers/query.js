module.exports = {
    getQuestions: async (parent, args, { models }) => models.Question.find(),
    getQuestion: async (parent, args, { models }) => {
        return models.Question.findById(args.id);
    },
    user: async (parent, { username }, { models }) => {
        return models.User.findOne({ username })
    },
    users: async (parent, args, { models }) => {
        return models.User.find({});
    },
    me: async (parent, args, { models, user }) => {
        return models.User.findById(user.id);
    },
}