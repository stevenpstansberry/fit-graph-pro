/**
 * @fileoverview Service to handle uploading user profile pictures to S3 and updating user profiles in DynamoDB.
 * 
 * @file backend/services/uploadProfilePictureService.js
 * 
 * Exposes a function:
 * - `uploadProfilePicture(event)`: Uploads a profile picture to S3 and updates the user's profile in DynamoDB.
 * 
 * This service interfaces with AWS S3 for file storage and AWS DynamoDB for user profile management.
 * 
 * @version 1.0.0
 * @author Steven Stansberry
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const S3 = new AWS.S3();
const util = require('../utils/util');

const s3Bucket = 'fit-graph-profile-pictures';
const userTable = 'fit-graph-users';  

/**
 * Uploads a profile picture to S3 and updates the user's profile with the image URL.
 * 
 * @function uploadProfilePicture
 * @param {Object} event - The event object containing user information and image data.
 * @returns {Promise<Object>} Response object with success or error message.
 */
async function uploadProfilePicture(event) {
    const { username, base64Image, fileType } = JSON.parse(event.body);

    if (!username || !base64Image || !fileType) {
        return util.buildResponse(400, { message: 'Missing required fields: username, base64Image, fileType' });
    }

    const imageBuffer = Buffer.from(base64Image, 'base64');
    const fileName = `profile-pictures/${username}.${fileType}`;
    const s3Params = {
        Bucket: s3Bucket,
        Key: fileName,
        Body: imageBuffer,
        ContentEncoding: 'base64', 
        ContentType: `image/${fileType}`
    };

    try {
        // Upload image to S3
        await S3.upload(s3Params).promise();

        // Construct the URL of the uploaded image
        const imageUrl = `https://${s3Bucket}.s3.amazonaws.com/${fileName}`;

        // Update the user's profile in DynamoDB
        const dbParams = {
            TableName: userTable,
            Key: { username: username },
            UpdateExpression: 'set profilePictureUrl = :url',
            ExpressionAttributeValues: {
                ':url': imageUrl,
            },
            ReturnValues: 'UPDATED_NEW'
        };

        await dynamodb.update(dbParams).promise();

        return util.buildResponse(200, { message: 'Profile picture uploaded successfully', imageUrl });

    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return util.buildResponse(500, { message: 'Failed to upload profile picture' });
    }
}

module.exports = {
    uploadProfilePicture,
};
