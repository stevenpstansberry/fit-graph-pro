/**
 * @fileoverview Service to upload a new workout split to DynamoDB.
 * 
 * @file backend/services/createSplit.js
 * 
 * Exposes the `uploadSplit()` function to handle the upload of a split.
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
const splitTable = 'fit-graph-user-splits';
const util = require('../utils/util');

/**
 * Uploads a new workout split to DynamoDB.
 * 
 * @async
 * @function uploadSplit
 * @param {Object} splitData - The split data to upload.
 * @param {string} splitData.splitId - The unique ID for the split.
 * @param {string} splitData.username - The username associated with the split.
 * @param {string} splitData.name - The name of the split.
 * @param {Array} splitData.exercises - The list of exercises in the split.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function uploadSplit(splitData) {
  const {splitId, exercises, name, username} = splitData;

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
