/**
 * @fileoverview Service to verify user authentication tokens.
 * 
 * @file backend/services/verify.js
 * 
 * Exposes the `verify()` function to handle token verification for authenticated users.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */


const util = require('../utils/util');
const auth = require('../utils/auth');

/**
 * Verifies the user's token to authenticate their session.
 * 
 * @function verify
 * @param {Object} requestBody - The request body containing user and token information.
 * @param {Object} requestBody.user - The user object.
 * @param {string} requestBody.user.username - The username of the user.
 * @param {string} requestBody.token - The authentication token to verify.
 * @returns {Object} Response object indicating whether the token is valid or not.
 */
function verify(requestBody) {
  // Validate the request body to ensure it contains the required user and token fields
  if (!requestBody.user || !requestBody.user.username || !requestBody.token) {
    return util.buildResponse(401, { 
      verified: false,
      message: 'incorrect request body'
    })
  }

  const user = requestBody.user;
  const token = requestBody.token;


  const verification = auth.verifyToken(user.username, token);
  if (!verification.verified) {
    return util.buildResponse(401, verification);
  }

  // Return success response with user and token if the token is verified
  return util.buildResponse(200, {
    verified: true,
    message: 'success',
    user: user,
    token: token
  })
}

module.exports.verify = verify;