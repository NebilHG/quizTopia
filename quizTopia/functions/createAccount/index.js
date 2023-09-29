const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');
const middy = require('@middy/core');

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    // Check if the account already exists
    const existingAccount = await db.get({
      TableName: 'accounts',
      Key: {
        username: username,
      },
    }).promise();

    if (existingAccount.Item) {
      return sendError(400, { success: false, message: 'Account already exists' });
    }

    // Create the new account
    const newAccount = {
      username: username,
      password: password, 
    };

    await db.put({
      TableName: 'accounts',
      Item: newAccount,
    }).promise();

    return sendResponse(200,{ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Error creating account:', error);
    return sendError(500, { success: false, message: 'Could not create account' });
  }
};

