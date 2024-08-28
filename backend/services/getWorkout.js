/**
 * @fileoverview Service to retrieve a workout by ID from DynamoDB.
 * 
 * @file backend/services/getWorkout.js
 * 
 * Exposes the `getWorkoutById()` function to handle retrieval of a workout.
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
 * Retrieves a workout by its ID from DynamoDB.
 * 
 * @async
 * @function getWorkoutById
 * @param {string} workoutId - The unique ID of the workout to retrieve.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function getWorkoutById(workoutId) {
  const params = {
    TableName: workoutTable,
    Key: {
      workoutId: workoutId
    }
  };

  try {
    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return util.buildResponse(404, { message: `Workout with ID ${workoutId} not found` });
    }

    return util.buildResponse(200, result.Item);

  } catch (error) {
    console.log('Error retrieving workout:', error);

    return util.buildResponse(500, { message: 'Internal Server Error' });
  }
}



module.exports.getWorkoutById = getWorkoutById;
