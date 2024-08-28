// ../services/createWorkout.js

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const workoutTable = 'fit-graph-user-workouts';
const util = require('../utils/util');

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
