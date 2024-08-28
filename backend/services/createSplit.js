// ../services/createSplit.js


const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const splitTable = 'fit-graph-user-splits';
const util = require('../utils/util');

async function uploadSplit(splitData) {
  const { id: splitId, exercises, name, username} = splitData;

  const splitName = name;

  const params = {
    TableName: splitTable,
    Item: {
      splitId, 
      username,
      splitName, 
      exercises
    }
  };

  try {
    await dynamodb.put(params).promise();
    return util.buildResponse(201, { message: 'Split uploaded successfully', splitId });
  } catch (error) {
    console.log('Error uploading workout:', error);
    return util.buildResponse(500, { message: 'Failed to upload Split' });
  }
}

module.exports = {
  uploadSplit
};
