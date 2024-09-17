/**
 * @fileoverview Service to delete a workout from DynamoDB by ID.
 * 
 * @file backend/services/workout-services/deleteWorkout.js
 * 
 * Exposes the `deleteWorkout()` function to handle the deletion of a workout.
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
const userTable = 'fit-graph-users';
const util = require('../../utils/util');
const common = require('../auth-services/common'); 

/**
 * Deletes a workout from DynamoDB by its ID.
 * Also decrements the user's workout count in the user table.
 * 
 * @async
 * @function deleteWorkout
 * @param {string} workoutId - The unique ID of the workout to delete.
 * @param {string} username - The username associated with the workout.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function deleteWorkout(workoutId, username) {
  // Retrieve user from the user table
  const dynamoUser = await common.getUser(userTable, username.toLowerCase().trim());

  // If user does not exist, return an error response
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(404, { message: 'User does not exist' });
  }

  // Decrement the user's workout count by 1
  await decrementWorkoutCount(username.toLowerCase().trim());

  // Delete the workout from the workout table
  const params = {
    TableName: workoutTable,
    Key: {
      workoutId: workoutId
    }
  };

  try {
    await dynamodb.delete(params).promise();
    return util.buildResponse(200, { message: 'Workout deleted successfully', workoutId });
  } catch (error) {
    console.log('Error deleting workout:', error);
    return util.buildResponse(500, { message: 'Failed to delete workout' });
  }
}

/**
 * Decrements the workoutCount field for a user in the user table.
 * 
 * @async
 * @function decrementWorkoutCount
 * @param {string} username - The username of the user.
 * @returns {Promise<void>}
 */
async function decrementWorkoutCount(username) {
  const params = {
    TableName: userTable,
    Key: { username },
    UpdateExpression: 'SET workoutCount = if_not_exists(workoutCount, :start) - :dec',
    ExpressionAttributeValues: {
      ':start': 0,
      ':dec': 1
    },
    ConditionExpression: 'workoutCount > :min', // Ensure workoutCount does not go below 0
    ExpressionAttributeValues: {
      ':min': 0,
      ':dec': 1
    }
  };

  try {
    await dynamodb.update(params).promise();
    console.log(`Decremented workout count for user: ${username}`);
  } catch (error) {
    console.error('Error decrementing workout count:', error);
  }
}

module.exports = {
  deleteWorkout
};
