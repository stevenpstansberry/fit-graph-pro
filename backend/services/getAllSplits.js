const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const workoutTable = 'fit-graph-user-splits';
const util = require('../utils/util');

async function getAllSplits() {
    const params = {
      TableName: workoutTable
    };
  
    try {
      const result = await dynamodb.scan(params).promise();
  
      if (!result.Items || result.Items.length === 0) {
        return util.buildResponse(404, { message: 'No splits found' });
      }
  
      return util.buildResponse(200, result.Items);
  
    } catch (error) {
      console.log('Error retrieving workouts:', error);
  
      return util.buildResponse(500, { message: 'Internal Server Error' });
    }
  }

  async function getSplitsForUser(username) {
    // const params = {
    //   TableName: workoutTable,
    //   FilterExpression: '#username = :username',
    //   ExpressionAttributeNames: {
    //     '#username': 'username'
    //   },
    //   ExpressionAttributeValues: {
    //     ':username': username
    //   }
    // };
  
    // try {
    //   const result = await dynamodb.scan(params).promise();
  
    //   if (!result.Items || result.Items.length === 0) {
    //     return util.buildResponse(404, { message: `No workouts found for user ${username}` });
    //   }
  
    //   return util.buildResponse(200, result.Items);
  
    // } catch (error) {
    //   console.log('Error retrieving workouts for user:', error);
  
    //   return util.buildResponse(500, { message: 'Internal Server Error' });
    // }
    return util.buildResponse(200, {message : `OK`});
  }
  
  module.exports = {
    getAllSplits
  };
