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
const util = require('../../utils/util');

/**
 * Deletes a workout from DynamoDB by its ID.
 * 
 * @async
 * @function deleteWorkout
 * @param {string} workoutId - The unique ID of the workout to delete.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function deleteWorkout(workoutId) {
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

module.exports = {
  deleteWorkout
};
