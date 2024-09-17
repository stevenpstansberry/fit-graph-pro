/**
 * @fileoverview Service to handle user login by verifying credentials and generating a token.
 * 
 * @file backend/services/auth-services/login.js
 * 
 * Exposes the `login()` function to handle user authentication.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
})
const util = require('../../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../../utils/auth');
const verifyPasswordService = require('./VerifyPassword');  
const common = require('./common');


const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fit-graph-users';

/**
 * Authenticates a user by verifying their credentials against stored data.
 * 
 * @async
 * @function login
 * @param {Object} user - The user object containing login credentials.
 * @param {string} user.username - The username of the user.
 * @param {string} user.password - The password of the user.
 * @returns {Promise<Object>} Response object indicating success or failure, including a token on success.
 */
async function login(user) {
  const username = user.username;
  const password = user.password;
  
  // Check if the user object and credentials are provided
  if (!user || !username || !password) {
    return util.buildResponse(401, {
      message: 'username and password are required'
    })
  }

  // Get user from DynamoDB or return error if user not found
  const dynamoUser = await common.getUser(userTable, username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, { message: 'user does not exist'});
  }

  // If workoutCount is not defined, initialize it to 0
  if (dynamoUser.workoutCount === undefined) {
    await initializeWorkoutCount(username.toLowerCase().trim());
    dynamoUser.workoutCount = 0;  
  }

  // Use verifyPassword function to check the password
  const verificationResult = await verifyPasswordService.verifyPassword({
    username: username.toLowerCase().trim(),
    password: password
  });

  // If password verification fails, return the error response
  if (verificationResult.statusCode !== 200) {
    return verificationResult;
  }

  // Prepare user info and generate an authentication token
  const userInfo = {
    username: dynamoUser.username,
    name: dynamoUser.name,
    email: dynamoUser.email,
    workoutCount: dynamoUser.workoutCount
  }

  // Conditionally add the s3ProfileURL if it exists
  if (dynamoUser.profilePictureUrl) {
    userInfo.s3ProfileURL = dynamoUser.profilePictureUrl;
  }

  const token = auth.generateToken(userInfo)

  // Response Object
  const response = {
    user: userInfo,
    token: token
  }
  return util.buildResponse(200, response);
}

/**
 * Initializes the workoutCount field to 0 for a user if it doesn't exist.
 * 
 * @async
 * @function initializeWorkoutCount
 * @param {string} username - The username of the user to update.
 * @returns {Promise<void>}
 */
async function initializeWorkoutCount(username) {
  const params = {
    TableName: userTable,
    Key: { username },
    UpdateExpression: 'SET workoutCount = :count',
    ExpressionAttributeValues: {
      ':count': 0
    }
  };

  try {
    await dynamodb.update(params).promise();
    console.log(`Initialized workoutCount for user: ${username}`);
  } catch (error) {
    console.error('Failed to initialize workoutCount:', error);
  }
}


module.exports.login = login;