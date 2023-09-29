const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');

exports.handler = async (event, context) => {
    
    try {
        const result = await db.scan({
            TableName: 'quiz-db',
        }).promise()

        return sendResponse(200, { 
            success: true,
            message: 'All quizes',
            quizes: result.Items
        })

    } catch (error) {
        console.log('Error getting quiz',error)
        return sendError(500, { success:false, message: 'could not get quiz' });
    }
};
