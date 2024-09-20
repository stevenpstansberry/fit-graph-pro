/**
 * @fileoverview Service to retrieve a user's profile picture URL from DynamoDB.
 * 
 * @file backend/services/getProfilePicture.js
 * 
 * Exposes one function:
 * - `getProfilePicture(username)`: Fetches the profile picture URL for a specified user.
 * 
 * This service interfaces with AWS DynamoDB using AWS SDK to fetch a user's profile picture URL from the 'fit-graph-users' table.
 * 
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const util = require('../utils/util');

const userTable = 'fit-graph-users';  

/**
 * Fetches profile picture URL for a specified user.
 * @function getProfilePicture
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} Response with profile picture URL or error message.
 */
async function getProfilePicture(username) {
    const params = {
        TableName: userTable,
        Key: {
            'username': username, 
        },
        ProjectionExpression: 'profilePictureUrl', // Retrieve the profilePictureUrl attribute
    };

    try {
        const result = await dynamodb.get(params).promise();

        if (!result.Item || !result.Item.profilePictureUrl) {
            return util.buildResponse(410, { message: `No profile picture found for user ${username}` });
        }

        return util.buildResponse(200, { profilePictureUrl: result.Item.profilePictureUrl });

    } catch (error) {
        console.error('Error retrieving profile picture for user:', error);
        return util.buildResponse(500, { message: 'Internal Server Error' });
    }
}

module.exports = {
    getProfilePicture,
};
