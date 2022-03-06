module.exports = {
    //user = parent
    questions: async (user, args, { module }) => {
        return await models.Question.find({author: user._id}).sort({_id: -1})
    }
}