/**
 * @fileoverview Service to upload a new workout to DynamoDB.
 * 
 * @file backend/services/createWorkout.js
 * 
 * Exposes the `uploadWorkout()` function to handle the upload of a workout.
 * 
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
 * Uploads a new workout to DynamoDB.
 * 
 * @async
 * @function uploadWorkout
 * @param {Object} workoutData - The workout data to upload.
 * @param {string} workoutData.id - The unique ID for the workout.
 * @param {string} workoutData.username - The username associated with the workout.
 * @param {string} workoutData.date - The name of the workout.
 * @param {string} workoutData.type - The type of workout (the split).
 * @param {Array} workoutData.exercises - The list of exercises in the workout.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function uploadWorkout(workoutData) {
  const { id: workoutId, username, date, type, exercises } = workoutData;

  const params = {
    TableName: workoutTable,
    Item: {
      workoutId, 
      username,
      date, 
      type,
      exercises
    }
  };

  try {
    await dynamodb.put(params).promise();
    return util.buildResponse(201, { message: 'Workout uploaded successfully', workoutId });
  } catch (error) {
    console.log('Error uploading workout:', error);
    return util.buildResponse(500, { message: 'Failed to upload workout' });
  }
}

module.exports = {
  uploadWorkout
};
