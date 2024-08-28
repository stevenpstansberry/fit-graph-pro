/**
 * @fileoverview Service to retrieve all workouts from DynamoDB for all users or a specific user.
 * 
 * @file backend/services/getAllWorkouts.js
 * 
 * Exposes two functions:
 * - `getAllWorkouts()`: Fetches all workouts.
 * - `getAllWorkoutsForUser(username)`: Fetches workouts for a specific user.
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
const workoutTable = 'fit-graph-user-workouts';
const util = require('../utils/util');

/**
 * Fetches all workouts from DynamoDB.
 * @function getAllWorkouts
 * @returns {Promise<Object>} Response with all workouts or error message.
 */
async function getAllWorkouts() {
    const params = {
      TableName: workoutTable
    };
  
    try {
      const result = await dynamodb.scan(params).promise();
  
      if (!result.Items || result.Items.length === 0) {
        return util.buildResponse(404, { message: 'No workouts found' });
      }
  
      return util.buildResponse(200, result.Items);
  
    } catch (error) {
      console.log('Error retrieving workouts:', error);
  
      return util.buildResponse(500, { message: 'Internal Server Error' });
    }
  }
/**
 * Fetches all workouts for a specific user from DynamoDB.
 * @function getAllWorkoutsForUser
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} Response with all workouts for the user or error message.
 */
  async function getAllWorkoutsForUser(username) {
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
        return util.buildResponse(404, { message: `No workouts found for user ${username}` });
      }
  
      return util.buildResponse(200, result.Items);
  
    } catch (error) {
      console.log('Error retrieving workouts for user:', error);
  
      return util.buildResponse(500, { message: 'Internal Server Error' });
    }
  }
  
  module.exports = {
    getAllWorkouts,
    getAllWorkoutsForUser
  };
