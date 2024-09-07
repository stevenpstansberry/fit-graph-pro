/**
 * @fileoverview Service for managing user authentication and session handling.
 * 
 * @file src/services/AuthService.js
 * 
 * Provides functions to handle user session management, including setting, retrieving, and resetting user information and tokens in session storage.
 * 
 * Utilizes sessionStorage to manage the user authentication state across the application.
 * 
 * @module AuthService
 * @version 1.0.0
 * @exports {Object} AuthService - An object containing authentication service methods.
 * 
 * @author Steven Stansberry
 */

module.exports = {
  /**
   * Retrieves the user object from session storage.
   * 
   * @function getUser
   * @returns {Object|null} The user object if available, otherwise null.
   */
  getUser: function () {
    const user = sessionStorage.getItem('user');
    if (user === 'undefined' || !user) {
      return null;
    } else {
      console.log("user info: " + user);
      return JSON.parse(user);
    }
  },

  /**
   * Retrieves the authentication token from session storage.
   * 
   * @function getToken
   * @returns {string|null} The token string if available, otherwise null.
   */
  getToken: function() {
    return sessionStorage.getItem('token');
  },

  /**
   * Saves the user object and token to session storage.
   * 
   * @function setUserSession
   * @param {Object} user - The user object to be saved.
   * @param {string} token - The authentication token to be saved.
   */
  setUserSession: function (user, token) {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
    console.log(sessionStorage);
  },

  /**
   * Clears the user session by removing the user and token from session storage.
   * 
   * @function resetUserSession
   */
  resetUserSession: function() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('profileImageUrl'); // Also remove the profile image URL
  },

  /**
   * Retrieves the profile image URL from session storage.
   * 
   * @function getProfileImageUrlFromSession
   * @returns {string|null} The profile image URL if available, otherwise null.
   */
  getProfileImageUrlFromSession: function() {
    return sessionStorage.getItem('profileImageUrl');
  },

  /**
   * Saves the profile image URL to session storage.
   * 
   * @function setProfileImageUrlToSession
   * @param {string} url - The URL of the profile image to be saved.
   */
  setProfileImageUrlToSession: function(url) {
    sessionStorage.setItem('profileImageUrl', url);
  },

  /**
   * Retrieves data from session storage.
   * 
   * @function getSessionData
   * @param {string} key - The key for the session storage item.
   * @returns {Object|null} The parsed object from session storage if available, otherwise null.
   */
   getSessionData : function (key) {
    const data = sessionStorage.getItem(key);
    if (data === 'undefined' || !data) {
      return null;
    } else {
      return JSON.parse(data);
    }
  },

  /**
   * Saves data to session storage.
   * 
   * @function setSessionData
   * @param {string} key - The key for the session storage item.
   * @param {Object} value - The value to be saved in session storage.
   */
   setSessionData : function (key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }  
};


