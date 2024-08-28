/**
 * @fileoverview Service to delete a workout split from DynamoDB by ID.
 * 
 * @file backend/services/deleteSplit.js
 * 
 * Exposes the `deleteSplit()` function to handle the deletion of a split.
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
 * Deletes a workout split from DynamoDB by its ID.
 * 
 * @async
 * @function deleteSplit
 * @param {string} splitId - The unique ID of the split to delete.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function deleteSplit(splitId) {
  const params = {
    TableName: splitTable,
    Key: {
      splitId: splitId
    }
  };

  try {
    await dynamodb.delete(params).promise();
    return util.buildResponse(200, { message: 'Split deleted successfully', splitId });
  } catch (error) {
    console.log('Error deleting split:', error);
    return util.buildResponse(500, { message: 'Failed to delete split' });
  }
}

module.exports = {
  deleteSplit
};
