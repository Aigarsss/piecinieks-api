module.exports = {
    questions: async (parent, args, { models }) => {
        // console.log(models.Question.find().sort({updatedAt: -1}))
        return models.Question.find().sort({updatedAt: -1})
    },
    question: async (parent, args, { models }) => {
        return models.Question.findById(args.id);
    },
    randomQuestion: async (parent, args, { models }) => {
        const result = await models.Question.aggregate([
            {
                $sample: { size: 1 }
            }
        ]);

        // Fix problem where _id is not returned because of not using the Model but returning js
        // https://stackoverflow.com/questions/58166982/graphql-returns-null-id-for-mongoose-aggregation-query
        result[0].id = result[0]._id;

        return result;
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