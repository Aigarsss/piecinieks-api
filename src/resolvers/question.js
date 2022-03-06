module.exports = {
    //question = parent
    author: async (question, args, { models }) => {
        return await models.User.findById(question.author);
    }
}