/**
 * @fileoverview Service to upload a new workout to DynamoDB.
 * 
 * @file backend/services/workout-services/createWorkout.js
 * 
 * Exposes the `uploadWorkout()` function to handle the upload of a workout.
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
 * Uploads a new workout to DynamoDB.
 * Also increments the user's workout count in the user table.
 * 
 * @async
 * @function uploadWorkout
 * @param {Object} workoutData - The workout data to upload.
 * @param {string} workoutData.workoutId - The unique ID for the workout.
 * @param {string} workoutData.username - The username associated with the workout.
 * @param {string} workoutData.date - The date of the workout.
 * @param {string} workoutData.type - The type of workout (the split).
 * @param {Array} workoutData.exercises - The list of exercises in the workout.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function uploadWorkout(workoutData) {
  const { workoutId, username, date, type, exercises } = workoutData;

  // Retrieve user from the user table
  const dynamoUser = await common.getUser(userTable, username.toLowerCase().trim());

  // If user does not exist, return an error response
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(404, { message: 'User does not exist' });
  }

  // Increment the user's workout count by 1
  await incrementWorkoutCount(username.toLowerCase().trim());

  // Upload the workout to the workout table
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

/**
 * Increments the workoutCount field for a user in the user table.
 * 
 * @async
 * @function incrementWorkoutCount
 * @param {string} username - The username of the user.
 * @returns {Promise<void>}
 */
async function incrementWorkoutCount(username) {
  const params = {
    TableName: userTable,
    Key: { username },
    UpdateExpression: 'SET workoutCount = if_not_exists(workoutCount, :start) + :inc',
    ExpressionAttributeValues: {
      ':start': 0,
      ':inc': 1
    }
  };

  try {
    await dynamodb.update(params).promise();
    console.log(`Incremented workout count for user: ${username}`);
  } catch (error) {
    console.error('Error incrementing workout count:', error);
  }
}

module.exports = {
  uploadWorkout
};
