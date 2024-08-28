/**
 * @fileoverview Utility functions for handling JWT token generation and verification.
 * 
 * @file backend/util/auth.js
 * 
 * Provides `generateToken()` and `verifyToken()` functions to manage user authentication tokens.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */



const jwt = require('jsonwebtoken');


/**
 * Generates a JWT token for a given user.
 * 
 * @function generateToken
 * @param {Object} userInfo - The user information to encode in the token.
 * @param {string} userInfo.username - The username of the user.
 * @returns {string|null} The generated JWT token or null if userInfo is not provided.
 */
function generateToken(userInfo) {
  if (!userInfo) {
    return null;
  }

  // Sign the JWT token with user information and expiration time
  return jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: '1h' // Token expires in one hour
  })
}

/**
 * Verifies a JWT token to check its validity and ownership.
 * 
 * @function verifyToken
 * @param {string} username - The username to verify against the token.
 * @param {string} token - The JWT token to verify.
 * @returns {Object} An object indicating whether the token is verified and a message.
 */
function verifyToken(username, token) {
  // Verify the token using the secret key held in AWS Lambda .env
  return jwt.verify(token, process.env.JWT_SECRET, (error, response) => {
    if (error) {
      return {
        verified: false,
        message: 'invalid token'
      }
    }

    // Check token's username agaisnt provided username
    if (response.username !== username) {
      return {
        verified: false,
        message: 'invalid user'
      }
    }

    // Token is verified successfully
    return {
      verified: true,
      message: 'verifed'
    }
  })
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;