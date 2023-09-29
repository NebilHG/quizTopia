const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');

exports.handler = async (event, context) => {
    try {
        // Extract the quizId from the path parameter
        const { quizId } = event.pathParameters;

        // Define the DynamoDB query parameters
        const queryParams = {
            TableName: 'quiz-db',
            Key: {
                id: quizId, // Use the extracted quizId as the key
            },
        };

        // Retrieve the quiz by quizId
        const result = await db.get(queryParams).promise();

        // Check if the quiz was found
        if (!result.Item) {
            return sendError(404, {
                success: false,
                message: 'Quiz not found',
            });
        }

        // Return the found quiz as the response
        return sendResponse(200, {
            success: true,
            message: 'Quiz retrieved successfully',
            quiz: result.Item,
        });
    } catch (error) {
        console.error('Error getting quiz', error);
        return sendError(500, {
            success: false,
            message: 'Could not retrieve quiz',
        });
    }
};


