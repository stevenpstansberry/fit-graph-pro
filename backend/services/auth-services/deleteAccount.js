/**
 * @fileoverview Service to handle user account deletion by verifying credentials and removing user data (workouts and splits)
 * 
 * @file backend/services/auth-services/deleteAccount.js
 * 
 * Exposes the `deleteAccount()` function to handle user account removal.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});
const util = require('../../utils/util');
const verifyPasswordService = require('./VerifyPassword');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fit-graph-users';
const splitsTable = 'fit-graph-user-splits'; 
const workoutsTable = 'fit-graph-user-workouts';

/**
 * Deletes a user's account by verifying their credentials and removing their data from DynamoDB.
 * 
 * @async
 * @function deleteAccount
 * @param {Object} user - The user object containing login credentials.
 * @param {string} user.username - The username of the user.
 * @param {string} user.password - The password of the user.
 * @returns {Promise<Object>} Response object indicating success or failure of account deletion.
 */
async function deleteAccount(user) {

  const username = user.username;
  const password = user.password;
  
  // Check if the user object and credentials are provided
  if (!user || !username || !password) {
    return util.buildResponse(401, {
      message: 'username and password are required'
    });
  }

  // Get user from DynamoDB or return error if user not found
  const dynamoUser = await getUser(username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, { message: 'user does not exist' });
  }

  // Use verifyPassword function to check the password
  const verificationResult = await verifyPasswordService.verifyPassword({
    username: username.toLowerCase().trim(),
    password: password
  });

  // If password verification fails, return the error response
  if (verificationResult.statusCode !== 200) {
    return verificationResult;
  }

  // Delete user data from DynamoDB
  const deleteUserResponse = await deleteUser(username.toLowerCase().trim());
  if (!deleteUserResponse) {
    return util.buildResponse(503, { message: 'Server Error. Unable to delete user.' });
  }

  // Delete user's workout splits
  const deleteSplitsResponse = await deleteUserSplits(username.toLowerCase().trim());
  if (!deleteSplitsResponse) {
    return util.buildResponse(503, { message: 'Server Error. Unable to delete user splits.' });
  }

  // Delete user's workouts
  const deleteWorkoutsResponse = await deleteUserWorkouts(username.toLowerCase().trim());
  if (!deleteWorkoutsResponse) {
    return util.buildResponse(503, { message: 'Server Error. Unable to delete user workouts.' });
  }

  return util.buildResponse(200, { message: 'Account successfully deleted.' });
}

/**
 * Deletes a user from DynamoDB based on the provided username.
 * 
 * @async
 * @function deleteUser
 * @param {string} username - The username of the user to delete.
 * @returns {Promise<boolean>} Returns true if the user is deleted successfully, otherwise false.
 */
async function deleteUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username
    }
  };

  return await dynamodb.delete(params).promise().then(() => {
    return true;
  }, error => {
    console.error('There is an error deleting user: ', error);
    return false;
  });
}

/**
 * Deletes all workouts associated with a user from DynamoDB.
 * 
 * @async
 * @function deleteUserWorkouts
 * @param {string} username - The username of the user whose workouts to delete.
 * @returns {Promise<boolean>} Returns true if the workouts are deleted successfully, otherwise false.
 */
async function deleteUserWorkouts(username) {
    // Scan to find all workouts for the user
    const params = {
      TableName: workoutsTable,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username
      }
    };
  
    try {
      const data = await dynamodb.scan(params).promise(); // Use scan instead of query
      if (data.Items.length > 0) {
        for (const workout of data.Items) {
          const deleteParams = {
            TableName: workoutsTable,
            Key: {
              workoutId: workout.workoutId // Use the partition key only
            }
          };
          await dynamodb.delete(deleteParams).promise();
        }
      }
      return true;
    } catch (error) {
      console.error('There is an error deleting user workouts: ', error);
      return false;
    }
  }
  

/**
 * Deletes all workout splits associated with a user from DynamoDB.
 * 
 * @async
 * @function deleteUserSplits
 * @param {string} username - The username of the user whose splits to delete.
 * @returns {Promise<boolean>} Returns true if the splits are deleted successfully, otherwise false.
 */
async function deleteUserSplits(username) {
    // Scan to find all splits for the user
    const params = {
      TableName: splitsTable,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username
      }
    };
  
    try {
      const data = await dynamodb.scan(params).promise(); // Use scan instead of query
      if (data.Items.length > 0) {
        for (const split of data.Items) {
          const deleteParams = {
            TableName: splitsTable,
            Key: {
              splitId: split.splitId // Use the partition key only
            }
          };
          await dynamodb.delete(deleteParams).promise();
        }
      }
      return true;
    } catch (error) {
      console.error('There is an error deleting user splits: ', error);
      return false;
    }
  }
  

/**
 * Retrieves a user from DynamoDB based on the provided username.
 * 
 * @async
 * @function getUser
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username
    }
  };

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error('There is an error getting user: ', error);
  });
}

module.exports.deleteAccount = deleteAccount;
