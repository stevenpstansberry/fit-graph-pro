/**
 * @fileoverview Service to update an existing workout split in DynamoDB.
 * 
 * @file backend/services/split-services/editSplit.js
 * 
 * Exposes the `editSplit()` function to handle the update of a split.
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
const util = require('../../utils/util');

/**
 * Updates an existing workout split in DynamoDB.
 * 
 * @async
 * @function editSplit
 * @param {Object} splitData - The split data to update.
 * @param {string} splitData.splitId - The unique ID for the split.
 * @param {string} splitData.username - The username associated with the split.
 * @param {string} splitData.name - The name of the split.
 * @param {Array} splitData.exercises - The list of exercises in the split.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function editSplit(splitData) {
  const { splitId, exercises, name, username } = splitData;
  const splitName = name;

  const params = {
    TableName: splitTable,
    Key: {
      splitId,
    },
    UpdateExpression: 'set splitName = :splitName, exercises = :exercises',
    ExpressionAttributeValues: {
      ':splitName': splitName,
      ':exercises': exercises
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const result = await dynamodb.update(params).promise();
    return util.buildResponse(200, { message: 'Split updated successfully', splitId, updatedAttributes: result.Attributes });
  } catch (error) {
    console.log('Error updating split:', error);
    return util.buildResponse(500, { message: 'Failed to update split' });
  }
}

module.exports = {
  editSplit
};