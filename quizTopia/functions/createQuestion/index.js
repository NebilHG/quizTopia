const { nanoid } = require('nanoid');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');

async function postQuestion(event) {
    const requestBody = JSON.parse(event.body);
    const { id, question, answer, coordinates, userId } = requestBody;
  
    const searchParams = {
      TableName: "quiz-db",
      Key: { id: id },
    };
  
    try {
      if (!question || !answer || !coordinates.latitude || !coordinates.longitude) {
        return sendError(400, { success: false, message: "Invalid body" });
      }
  
      const result = await db.get(searchParams).promise();
  
      if (!result.Item) {
        return sendError(404, { success: false, message: "Quiz not found" });
      }
  
      const params = {
        TableName: "quiz-db",
        Key: { id: id },
        ReturnValues: "ALL_NEW",
        UpdateExpression: "SET #qq = list_append(#qq, :newQuestion)",
        ExpressionAttributeNames: { "#qq": "questions" },
        ExpressionAttributeValues: {
          ":newQuestion": [
            {
              questionId: nanoid(),
              question: question,
              answer: answer,
              coordinates: coordinates,
            },
          ],
        },
      };
  
      const quizCreator = result.Item.userId;
      if (userId !== quizCreator) {
        return sendError(401, { message: "Not authorized to add question in this quiz", quizCreator: quizCreator, userIdBody: userId });
      }
  
      await db.update(params).promise();
  
      const newQ = params.ExpressionAttributeValues[":newQuestion"][0];
      const response = {
        id,
        userId,
        question: newQ,
      };
  
      return sendResponse(200, { success: true, result: response });
    } catch (error) {
      return sendError(500, { success: false, error: error });
    }
  }
  
  export const handler = middy(postQuestion)
  .use(validateToken)
  .handler(postQuestion);