/**
 * @fileoverview Service to handle user registration by saving new user data to DynamoDB.
 * 
 * @file backend/services/register.js
 * 
 * Exposes the `register()` function to handle the creation of a new user.
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
 * Registers a new user by storing their details in DynamoDB.
 * 
 * @async
 * @function register
 * @param {Object} userInfo - The user information for registration.
 * @param {string} userInfo.name - The name of the user.
 * @param {string} userInfo.email - The email of the user.
 * @param {string} userInfo.username - The username of the user.
 * @param {string} userInfo.password - The password of the user.
 * @returns {Promise<Object>} Response object indicating success or failure of registration.
 */
async function register(userInfo) {
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;

    // Check if all required fields are provided
    if (!username || !name || !email || !password) {
      return util.buildResponse(401, {
        message: 'All fields are required'
      })
    }

    // Check if the username already exists in DynamoDB    
    const dynamoUser = await getUser(username.toLowerCase().trim());
    if (dynamoUser && dynamoUser.username) {
      return util.buildResponse(401, {
        message: 'username already exists in our database. please choose a different username'
      })
    }

    // Encrypt the password before storing    
    const encryptedPW = bcrypt.hashSync(password.trim(), 10);
    const user = {
      name: name,
      email: email,
      username: username.toLowerCase().trim(),
      password: encryptedPW
    }

    // Save the new user data to DynamoDB    
    const saveUserResponse = await saveUser(user);
    if (!saveUserResponse) {
      return util.buildResponse(503, { message: 'Server Error. Please try again later.'});
    }
  
    // Return success response with the new username
    return util.buildResponse(200, { username: username });
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

  
/**
 * Saves a new user to DynamoDB.
 * 
 * @async
 * @function saveUser
 * @param {Object} user - The user object containing user details to save.
 * @returns {Promise<boolean>} Returns true if the user is saved successfully, otherwise false.
 */
  async function saveUser(user) {
    const params = {
      TableName: userTable,
      Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
      return true;
    }, error => {
      console.error('There is an error saving user: ', error)
    });
  }
  
  module.exports.register = register;