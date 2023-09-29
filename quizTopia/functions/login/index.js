const jwt = require('jsonwebtoken');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');
const middy = require('@middy/core');

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    // Check if the account exists
    const existingAccount = await db.get({
      TableName: 'accounts',
      Key: {
        username: username,
      },
    }).promise();

    if (!existingAccount.Item) {
      return sendError(400, { success: false, message: 'Account does not exist' });
    }

    // Compare the provided password with the stored password (you should implement secure password handling)
    if (existingAccount.Item.password !== password) {
      return sendError(401, { success: false, message: 'Invalid password' });
    }

    // Generate a JWT token with user information
    const token = jwt.sign(
      {
        id: existingAccount.Item.id,
        username: existingAccount.Item.username,
        // Add any other user information you need in the token payload
      },
      'a1b1c1', // Replace with your actual secret key
      {
        expiresIn: '1h', // Token expiration time (adjust as needed)
      }
    );

    // Return the generated JWT token in the response
    return sendResponse(200, { success: true, token });
  } catch (error) {
    console.error('Error logging in:', error);
    return sendError(500, { success: false, message: 'Could not log in' });
  }
};
