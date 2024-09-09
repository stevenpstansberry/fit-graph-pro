/**
 * @fileoverview Service to handle user password reset by generating a new password and updating it in the database.
 * 
 * @file backend/services/PasswordReset.js
 * 
 * Exposes the `resetPassword()` function to handle user password reset requests.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

// TODO: once SES is set up, add email verification

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ses = new AWS.SES({ apiVersion: '2010-12-01' });


const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fit-graph-users';

/**
 * Resets a user's password by generating a new password and updating it in the database.
 * 
 * @async
 * @function resetPassword
 * @param {Object} event - The event object containing the body with the email.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function resetPassword(event) {
    // Parse the JSON string body to a JavaScript object
    const body = JSON.parse(event.body);
    const email = body.email;
  
    // Check if the email is provided
    if (!email) {
      return util.buildResponse(401, {
        message: 'email is required'
      });
    }
  
    // Get user from DynamoDB or return error if user not found
    const dynamoUser = await getUserByEmail(email.toLowerCase().trim());
    if (!dynamoUser || !dynamoUser.email) {
      return util.buildResponse(403, { message: 'user does not exist' });
    }
  
    // Generate a new random password
    const newPassword = generateRandomPassword();
  
    // Hash the new password before saving it
    const encryptedPW = bcrypt.hashSync(newPassword.trim(), 10);
  
    // Update the user's password in DynamoDB
    await updateUserPasswordByUsername(dynamoUser.username, encryptedPW);
  
    // Temporarily log the new password to the console for testing
    console.log(`Password reset successful. New password for user with email ${email}: ${newPassword}... ${encryptedPW}`);
  
    await sendResetEmail(dynamoUser.email, newPassword);
  
    return util.buildResponse(200, { message: `Password reset successful.` });
  }

/**
 * Sends an email to the user with their new password using AWS SES.
 * 
 * @async
 * @function sendResetEmail
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} newPassword - The new password to send to the user.
 * @returns {Promise<void>}
 */
async function sendResetEmail(recipientEmail, newPassword) {
  const params = {
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p>Your password has been reset. Your new password is: <strong>${newPassword}</strong></p><p>Please login and change your password immediately.</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Your password has been reset. Your new password is: ${newPassword}. Please login and change your password immediately.`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Your Password Reset for FitGraphPro",
      },
    },
    Source: process.env.SES_SOURCE_EMAIL, 
    ReplyToAddresses: [process.env.SES_REPLY_TO_EMAIL], 
  };

  await ses.sendEmail(params).promise();
}
  

/**
 * Retrieves a user from DynamoDB based on the provided email using a Scan operation.
 * 
 * @async
 * @function getUserByEmail
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
async function getUserByEmail(email) {
  const params = {
    TableName: userTable,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  return await dynamodb.scan(params).promise().then(response => {
    return response.Items[0]; // Return the first matching user
  }, error => {
    console.error('There is an error getting user by email: ', error);
  });
}

/**
 * Updates the user's password in DynamoDB 
 * 
 * @async
 * @function updateUserPasswordByUsername
 * @param {string} user - The user
 * @param {string} newPassword - The new encrypted password to be set.
 * @returns {Promise<void>}
 */
async function updateUserPasswordByUsername(username, newPassword) {
  // Fetch the user by scanning the table to get the username (primary key)


  const params = {
    TableName: userTable,
    Key: { username: username }, // Update based on username (primary key)
    UpdateExpression: 'set #password = :password',
    ExpressionAttributeNames: { '#password': 'password' },
    ExpressionAttributeValues: { ':password': newPassword }
  };

  return await dynamodb.update(params).promise().then(() => {
    console.log('Password updated successfully for user with username:', username);
  }, error => {
    console.error('There is an error updating user password by email: ', error);
  });
}

/**
 * Generates a random password for the user.
 * 
 * @function generateRandomPassword
 * @returns {string} A random password string.
 */
function generateRandomPassword() {
  return crypto.randomBytes(8).toString('hex'); // Generates a 16-character hex string
}

module.exports.resetPassword = resetPassword;
