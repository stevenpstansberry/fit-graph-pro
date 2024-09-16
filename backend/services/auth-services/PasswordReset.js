/**
 * @fileoverview Service to handle user password reset by generating a reset link and updating the password in the database.
 * 
 * @file backend/services/auth-services/PasswordReset.js
 * 
 * Exposes the `resetPassword()` and `verifyResetToken()` functions to handle user password reset requests.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});
const util = require('../../utils/util');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const ses = new AWS.SES({ apiVersion: '2010-12-01' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fit-graph-users';

/**
 * Initiates a password reset by generating a secure reset link and sending it to the user's email.
 * 
 * @async
 * @function resetPassword
 * @param {Object} event - The event object containing the body with the email.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function resetPassword(event) {
  const body = JSON.parse(event.body);
  const email = body.email;

  if (!email) {
    return util.buildResponse(401, {
      message: 'email is required'
    });
  }

  // Get user from DynamoDB
  const dynamoUser = await getUserByEmail(email.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.email) {
    return util.buildResponse(403, { message: 'user does not exist' });
  }

  // Generate a secure token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

  // Update the user in DynamoDB with the token and expiry time
  await updateUserResetToken(dynamoUser.username, resetToken, tokenExpiry);

  // Send email with reset link
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(dynamoUser.email)}`;
  await sendResetEmail(dynamoUser.email, resetLink);

  return util.buildResponse(200, { message: `Password reset link sent to ${dynamoUser.email}.` });
}

/**
 * Verifies the reset token and updates the user's password in DynamoDB.
 * 
 * @async
 * @function verifyResetToken
 * @param {Object} event - The event object containing the body with token, email, and new password.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function verifyResetToken(event) {
  const body = JSON.parse(event.body);
  const { email, token, newPassword } = body;

  // Validate input
  if (!email || !token || !newPassword) {
    return util.buildResponse(400, { message: 'Missing parameters.' });
  }

  const dynamoUser = await getUserByEmail(email.toLowerCase().trim());
  if (!dynamoUser || dynamoUser.resetToken !== token || Date.now() > dynamoUser.tokenExpiry) {
    return util.buildResponse(403, { message: 'Invalid or expired token.' });
  }

  // Hash the new password
  const encryptedPW = bcrypt.hashSync(newPassword.trim(), 10);

  // Update password in DynamoDB
  await updateUserPasswordByUsername(dynamoUser.username, encryptedPW);

  // Clear reset token and expiry
  await updateUserResetToken(dynamoUser.username, null, null);

  return util.buildResponse(200, { message: 'Password has been reset successfully.' });
}

/**
 * Sends an email to the user with the password reset link using AWS SES.
 * 
 * @async
 * @function sendResetEmail
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} resetLink - The password reset link to send to the user.
 * @returns {Promise<void>}
 */
async function sendResetEmail(recipientEmail, resetLink) {
  const params = {
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p>Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p><p>This link is valid for one hour.</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Click the link below to reset your password: ${resetLink}. This link is valid for one hour.`,
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
 * Updates the user's reset token and expiry time in DynamoDB.
 * 
 * @async
 * @function updateUserResetToken
 * @param {string} username - The username of the user.
 * @param {string} resetToken - The generated reset token.
 * @param {number} tokenExpiry - The expiry time of the reset token in milliseconds.
 * @returns {Promise<void>}
 */
async function updateUserResetToken(username, resetToken, tokenExpiry) {
  const params = {
    TableName: userTable,
    Key: { username: username },
    UpdateExpression: 'set #resetToken = :resetToken, #tokenExpiry = :tokenExpiry',
    ExpressionAttributeNames: {
      '#resetToken': 'resetToken',
      '#tokenExpiry': 'tokenExpiry'
    },
    ExpressionAttributeValues: {
      ':resetToken': resetToken,
      ':tokenExpiry': tokenExpiry
    }
  };

  return await dynamodb.update(params).promise().then(() => {
    console.log('Reset token updated successfully for user with username:', username);
  }, error => {
    console.error('There is an error updating reset token for user:', error);
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
  const params = {
    TableName: userTable,
    Key: { username: username },
    UpdateExpression: 'set #password = :password',
    ExpressionAttributeNames: { '#password': 'password' },
    ExpressionAttributeValues: { ':password': newPassword }
  };

  return await dynamodb.update(params).promise().then(() => {
    console.log('Password updated successfully for user with username:', username);
  }, error => {
    console.error('There is an error updating user password:', error);
  });
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

module.exports.resetPassword = resetPassword;