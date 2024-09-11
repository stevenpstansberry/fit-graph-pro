/**
 * @fileoverview Service to retrieve all workout splits from DynamoDB for all users or a specific user.
 * 
 * @file backend/services/split-services/getAllSplits.js
 * 
 * Exposes two functions:
 * - `getAllSplits()`: Fetches all splits.
 * - `getSplitsForUser(username)`: Fetches splits for a specific user.
 * 
 * This service interfaces with AWS DynamoDB using AWS SDK.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */




const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const workoutTable = 'fit-graph-user-splits';
const util = require('../../utils/util');

/**
 * Fetches all workout splits from DynamoDB.
 * 
 * @async
 * @function getAllSplits
 * @returns {Promise<Object>} Response with all splits or an error message.
 */
async function getAllSplits() {
    const params = {
      TableName: workoutTable
    };
  
    try {
      const result = await dynamodb.scan(params).promise();
  
      if (!result.Items || result.Items.length === 0) {
        return util.buildResponse(410, { message: 'No splits found' });
      }
  
      return util.buildResponse(200, result.Items);
  
    } catch (error) {
      console.log('Error retrieving splits:', error);
  
      return util.buildResponse(500, { message: 'Internal Server Error' });
    }
  }

/**
 * Fetches all workout splits for a specific user from DynamoDB.
 * 
 * @async
 * @function getSplitsForUser
 * @param {string} username - The username of the user whose splits are being retrieved.
 * @returns {Promise<Object>} Response with the splits for the user or an error message.
 */
  async function getSplitsForUser(username) {
    const params = {
      TableName: workoutTable,
      FilterExpression: '#username = :username',
      ExpressionAttributeNames: {
        '#username': 'username'
      },
      ExpressionAttributeValues: {
        ':username': username
      }
    };
  
    try {
      const result = await dynamodb.scan(params).promise();
  
      if (!result.Items || result.Items.length === 0) {
        return util.buildResponse(404, { message: `No splits found for user ${username}` });
      }
  
      return util.buildResponse(200, result.Items);
  
    } catch (error) {
      console.log('Error retrieving splits for user:', error);
  
      return util.buildResponse(500, { message: 'Internal Server Error' });
    }
  }
  
  module.exports = {
    getAllSplits,
    getSplitsForUser
  };
