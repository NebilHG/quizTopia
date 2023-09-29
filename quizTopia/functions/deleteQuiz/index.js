
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');

exports.handler = async (event, context) => {
    const {quizId} = event.pathParameters;

    try {
        await db.delete({
            TableName: 'quiz-db',
            Key: { id:quizId }
        }).promise()

        return sendResponse(200, { success: true })

    } catch (error) {
        console.log('Error deleting quiz:', error)
        return sendError(500, { sucecss:false, message: 'could not remove quiz' });
    }
};
