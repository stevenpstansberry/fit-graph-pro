const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const workoutTable = 'fit-graph-user-workouts';
const util = require('./utils/util'); 

async function getAllWorkouts() {
  const params = {
    TableName: workoutTable
  };

  try {
    const result = await dynamodb.scan(params).promise();
    
    if (!result.Items || result.Items.length === 0) {
      // Return a 404 response if no workouts are found
      return util.buildResponse(404, { message: 'No workouts found' });
    }

    // Return a 200 response with all workouts
    return util.buildResponse(200, result.Items);

  } catch (error) {
    console.log('Error retrieving workouts:', error);

    // Return a 500 response in case of any internal server error
    return util.buildResponse(500, { message: 'Internal Server Error' });
  }
}

module.exports.getAllWorkouts = getAllWorkouts;
