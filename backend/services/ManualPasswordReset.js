/**
 * @fileoverview Service to handle manual user password reset by updating the new password in the database.
 * 
 * @file backend/services/ManualPasswordReset.js
 * 
 * Exposes the `manualPasswordReset()` function to handle user password reset requests.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});
const util = require('../utils/util');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fit-graph-users';

/**
 * Manually resets a user's password by accepting a new password and updating it in the database.
 * 
 * @async
 * @function manualPasswordReset
 * @param {Object} event - The event object containing the body with the username and new password.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function manualPasswordReset(event) {
  // Parse the JSON string body to a JavaScript object
  const body = JSON.parse(event.body);
  const username = body.username;
  const newPassword = body.password;

  // Check if the username and new password are provided
  if (!username || !newPassword) {
    return util.buildResponse(401, {
      message: 'username and newPassword are required'
    });
  }

  // Get user from DynamoDB or return error if user not found
  const dynamoUser = await getUserByUsername(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, { message: 'user does not exist' });
  }

  // Hash the new password before saving it
  const encryptedPW = bcrypt.hashSync(newPassword.trim(), 10);

  // Update the user's password in DynamoDB
  await updateUserPasswordByUsername(dynamoUser.username, encryptedPW);

  console.log(`Password reset successful for user with username ${username}.`);

  return util.buildResponse(200, { message: `Password reset successful for user ${username}.` });
}

/**
 * Retrieves a user from DynamoDB based on the provided username (Primary Key).
 * 
 * @async
 * @function getUserByUsername
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
async function getUserByUsername(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username
    }
  };

  return await dynamodb.get(params).promise().then(response => {
    return response.Item; // Return the user object if found
  }, error => {
    console.error('There is an error getting user by username: ', error);
  });
}

/**
 * Updates the user's password in DynamoDB using their username.
 * 
 * @async
 * @function updateUserPasswordByUsername
 * @param {string} username - The username of the user to update.
 * @param {string} newPassword - The new encrypted password to be set.
 * @returns {Promise<void>}
 */
async function updateUserPasswordByUsername(username, newPassword) {
  const params = {
    TableName: userTable,
    Key: { username: username }, 
    UpdateExpression: 'set #password = :password',
    ExpressionAttributeNames: { '#password': 'password' },
    ExpressionAttributeValues: { ':password': newPassword }
  };

  return await dynamodb.update(params).promise().then(() => {
    console.log('Password updated successfully for user with username:', username);
  }, error => {
    console.error('There is an error updating user password by username: ', error);
  });
}

module.exports.manualPasswordReset = manualPasswordReset;
