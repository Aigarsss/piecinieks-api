const mongoose = require('mongoose');

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

const replaceSpecialCharacters = (string) => {
    string = string.replace(/ā/g, "a");
    string = string.replace(/ē/g, "e");
    string = string.replace(/ī/g, "i");
    string = string.replace(/ū/g, "u");

    string = string.replace(/č/g, "c");
    string = string.replace(/ģ/g, "g");
    string = string.replace(/ķ/g, "k");
    string = string.replace(/ļ/g, "l");
    string = string.replace(/ņ/g, "n");
    string = string.replace(/š/g, "s");
    string = string.replace(/ž/g, "z");

    return string;
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
        const ObjectId = mongoose.Types.ObjectId;

        const result = await models.Question.aggregate([
            // Filter out all ids, that have already been shown
            // TODO maybe add error handling, as it will error if no questions left, but should not happen
            {
                $match: { _id: { $nin: args.usedIds.map(id => ObjectId(id)) } }
            },
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

        const submittedAnswer = replaceSpecialCharacters(args.answer.trim().toLowerCase());
        const acceptedAnswers = (question.acceptedAnswers).split(',');
        const allowedDifferencesInSpelling = 1;

        // Check correct answer
        acceptedAnswers.forEach(accepted => {
            accepted = replaceSpecialCharacters(accepted.trim().toLowerCase());

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