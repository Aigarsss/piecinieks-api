module.exports = {
    addQuestion: async (parent, { question, answer, acceptedAnswers, airedAt }, { models }) => {
        return await models.Question.create(
            {
                question: question,
                answer: answer,
                acceptedAnswers: acceptedAnswers,
                airedAt: airedAt
            }
        );
    },
    deleteQuestion: async (parent, { id }, { models }) => {
        try {
            await models.Question.findOneAndRemove({ _id: id })
            return true;
        } catch (err) {
            return false;
        }
    },
    updateQuestion: async (parent, { question, answer, acceptedAnswers, airedAt, id }, { models }) => {
        return await models.Question.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    question,
                    answer,
                    acceptedAnswers,
                    airedAt
                }
            },
            {
                new: true
            }
        )
    }
}