/**
 * @fileoverview Service to handle user login by verifying credentials and generating a token.
 * 
 * @file backend/services/login.js
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
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

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
  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, { message: 'user does not exist'});
  }

  // Verify the provided password against the stored hashed password
  if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(403, { message: 'password is incorrect'});
  }

  // Prepare user info and generate an authentication token
  const userInfo = {
    username: dynamoUser.username,
    name: dynamoUser.name,
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

module.exports.login = login;