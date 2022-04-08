// Compare words. Word and Wold will match
// Usage:
// if (hammingDistance("Word", "wold") <= 1) {
//     console.log('Match')
// }
const hammingDistance = ( str1, str2 ) => {
    let dist = 0;
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    for (let i = 0, j = Math.max(str1.length, str2.length); i < j; i++) {
        if (!str1[i] || !str2[i] || str1[i] !== str2[i]) {
            dist++;
        }
    }
    return dist;
}

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
    checkAnswer: async (parent, args, { models }) => {
        const question = await models.Question.findById(args.id);
        question.id = question._id
        question.isCorrect = false;

        const submittedAnswer = args.answer.trim().toLowerCase();
        const acceptedAnswers = (question.acceptedAnswers).split(',');
        const allowedDifferencesInSpelling = 1;

        // Check correct answer
        acceptedAnswers.forEach(accepted => {
            accepted = accepted.trim().toLowerCase();

            if (hammingDistance(accepted, submittedAnswer) <= allowedDifferencesInSpelling) {
                question.isCorrect = true;
            }
        })

        return question;
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