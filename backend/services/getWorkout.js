const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const workoutTable = 'fit-graph-user-workouts';
const util = require('../utils/util');

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
