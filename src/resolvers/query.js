module.exports = {
    getQuestions: async (parent, args, { models }) => models.Question.find(),
    getQuestion: async (parent, args, { models }) => {
        return models.Question.findById(args.id);
    }
}