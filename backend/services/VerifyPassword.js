/**
 * @fileoverview Service to handle user password verification by comparing the provided encrypted password with the stored hash.
 * 
 * @file backend/services/VerifyPassword.js
 * 
 * Exposes the `verifyPassword()` function to handle password verification requests.
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
 * Verifies a user's password by comparing the provided encrypted password with the stored hash in DynamoDB.
 * 
 * @async
 * @function verifyPassword
 * @param {Object} user - The user object containing verification details.
 * @param {string} user.email - The email of the user.
 * @param {string} user.username - The username of the user.
 * @param {string} user.password - The encrypted password provided by the user to verify.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function verifyPassword(user) {
  const { username, password } = user;
  
  // Check if the user object and credentials are provided
  if (!user ||  !username || !password) {
    return util.buildResponse(401, {
      message: ' username, and password are required'
    });
  }

  // Get user from DynamoDB or return error if user not found
  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, { message: 'user does not exist' });
  }

  // Verify if the username matches the retrieved user
  if (dynamoUser.username !== username.toLowerCase().trim()) {
    return util.buildResponse(403, { message: 'username does not match the provided email' });
  }

  // Verify the provided password against the stored hashed password
  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(405, { message: 'password is incorrect' });
  }

  return util.buildResponse(200, { message: 'Password verified successfully' });
}

/**
 * Retrieves a user from DynamoDB based on the provided username.
 * 
 * @async
 * @function getUser
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
async function getUser(username) {
    const params = {
      TableName: userTable,
      Key: {
        username: username
      }
    }
  
    return await dynamodb.get(params).promise().then(response => {
      return response.Item;
    }, error => {
      console.error('There is an error getting user: ', error);
    })
  }

module.exports.verifyPassword = verifyPassword;
