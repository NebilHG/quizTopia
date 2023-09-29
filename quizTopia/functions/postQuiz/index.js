const { nanoid } = require('nanoid');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');

async function createQuiz(event) {
    
    try {
        const requestBody = JSON.parse(event.body);
        const { name, userId } = requestBody;
       await db.put({
            TableName: 'quiz-db',
            Item: {
                id: nanoid(),
                name: name,
                userId: userId,
                questions:[]
            },
        }).promise();

        return sendResponse(200, { success: true, });
    } catch (error) {
        console.error('Error creating quiz:', error);
        return sendError(500, { success: false, message: 'Could not create quiz' });
    }
}

export const handler = middy(createQuiz)
.use(validateToken)
.handler(createQuiz);

