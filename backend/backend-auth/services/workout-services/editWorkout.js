/**
 * @fileoverview Service to update an existing workout in DynamoDB.
 * 
 * @file backend/services/workout-services/updateWorkout.js
 * 
 * Exposes the `updateWorkout()` function to handle the update of a workout.
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
const util = require('../../utils/util');

/**
 * Updates an existing workout in DynamoDB.
 * 
 * @async
 * @function editWorkout
 * @param {Object} workoutData - The workout data to update.
 * @param {string} workoutData.workoutId - The unique ID for the workout.
 * @param {string} workoutData.username - The username associated with the workout.
 * @param {string} workoutData.date - The name of the workout.
 * @param {string} workoutData.type - The type of workout (the split).
 * @param {Array} workoutData.exercises - The list of exercises in the workout.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function editWorkout(workoutData) {
  const { workoutId, username, date, type, exercises } = workoutData;

  const params = {
    TableName: workoutTable,
    Key: { workoutId }, // Identify the workout by its unique ID
    UpdateExpression: "set #username = :username, #date = :date, #type = :type, #exercises = :exercises",
    ExpressionAttributeNames: {
      "#username": "username",
      "#date": "date",
      "#type": "type",
      "#exercises": "exercises"
    },
    ExpressionAttributeValues: {
      ":username": username,
      ":date": date,
      ":type": type,
      ":exercises": exercises
    },
    ReturnValues: "UPDATED_NEW" // Return only the updated attributes
  };

  try {
    const result = await dynamodb.update(params).promise();
    return util.buildResponse(200, { message: 'Workout updated successfully', updatedAttributes: result.Attributes });
  } catch (error) {
    console.log('Error updating workout:', error);
    return util.buildResponse(500, { message: 'Failed to update workout' });
  }
}

module.exports = {
  editWorkout
};
