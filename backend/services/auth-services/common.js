/**
 * @fileoverview Common utility functions for backend services.
 * 
 * This file provides common functions that are used across backend services to interact with AWS DynamoDB.
 * It includes functions for retrieving user information from DynamoDB and other common operations.
 * 
 * @file backend/services/auth-services/common.js
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 * 
 */

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * Retrieves a user from DynamoDB based on the provided username.
 * 
 * @async
 * @function getUser
 * @param {string} tableName - The name of the table to retrieve the user from.
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
async function getUser(tableName, username) {
    const params = {
      TableName: tableName,
      Key: {
        username: username
      }
    };

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
      }, error => {
        console.error('There is an error getting user: ', error);
      });
    }

module.exports.getUser = getUser;