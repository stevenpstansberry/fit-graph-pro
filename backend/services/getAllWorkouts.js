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
 * @returns {Promise<Object>} Response with all workouts within the DB or error message.
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

/**
 * Fetches all workouts for a specific user from DynamoDB for the past 'x' days.
 * @function getWorkoutsForUserByDays
 * @param {string} username - The username of the user.
 * @param {number} days - The number of days to look back.
 * @returns {Promise<Object>} Response with workouts from the set days for the user or error message.
 */
async function getWorkoutsForUserByDays(username, days) {
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - days); // Calculate the date 'x' days ago

  // Format the pastDate as 'YYYY-MM-DD' for comparison
  const pastDateString = pastDate.toISOString().split('T')[0];

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
      return util.buildResponse(404, { message: `No workouts found for user ${username} in the past ${days} days` });
    }

    // Filter workouts by date using string comparison for 'YYYY-MM-DD' format
    const filteredWorkouts = result.Items.filter(workout => workout.date >= pastDateString);

    if (filteredWorkouts.length === 0) {
      return util.buildResponse(404, { message: `No workouts found for user ${username} in the past ${days} days` });
    }

    return util.buildResponse(200, filteredWorkouts);

  } catch (error) {
    console.log('Error retrieving workouts for user by days:', error);

    return util.buildResponse(500, { message: 'Internal Server Error' });
  }
}

/**
 * Fetches the last 'count' workouts for a specific user from DynamoDB.
 * @function getRecentWorkoutsForUser
 * @param {string} username - The username of the user.
 * @param {number} count - The number of recent workouts to retrieve.
 * @returns {Promise<Object>} Response with the last 'count' amount of workouts for the user or error message.
 */
async function getRecentWorkoutsForUser(username, count) {
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

    console.log('Workouts retrieved from DynamoDB:', result.Items);

    // Sort workouts by date descending
    const sortedWorkouts = result.Items
      .filter(item => item.date)  // Ensure there is a date field
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Correctly parse date strings
      .slice(0, count); // Get the 'count' number of recent workouts

    console.log('Sorted and filtered workouts:', sortedWorkouts);

    return util.buildResponse(200, sortedWorkouts);

  } catch (error) {
    console.log('Error retrieving recent workouts for user:', error);

    return util.buildResponse(500, { message: 'Internal Server Error' });
  }
}


  
module.exports = {
  getAllWorkouts,
  getAllWorkoutsForUser,
  getWorkoutsForUserByDays,
  getRecentWorkoutsForUser
};