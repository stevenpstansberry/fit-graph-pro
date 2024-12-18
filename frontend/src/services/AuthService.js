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

const AuthService = {
  /**
   * Retrieves the user object from session storage.
   *
   * @function getUser
   * @returns {Object|null} The user object if available, otherwise null.
   */
  getUser: () => {
    const user = sessionStorage.getItem("user");
    if (user === "undefined" || !user) {
      console.log("No user found in session storage.");
      return null;
    } else {
      return JSON.parse(user);
    }
  },

  /**
   * Retrieves the authentication token from session storage.
   *
   * @function getToken
   * @returns {string|null} The token string if available, otherwise null.
   */
  getToken: () => {
    return sessionStorage.getItem("token");
  },

  /**
   * Saves the user object and token to session storage.
   *
   * @function setUserSession
   * @param {Object} user - The user object to be saved.
   * @param {string} token - The authentication token to be saved.
   */
  setUserSession: (user, token) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("token", token);
  },

  /**
   * Clears the user session by clearing all session storage.
   *
   * @function resetUserSession
   */
  resetUserSession: () => {
    sessionStorage.clear();
  },

  /**
   * Retrieves the profile image URL from session storage.
   *
   * @function getProfileImageUrlFromSession
   * @returns {string|null} The profile image URL if available, otherwise null.
   */
  getProfileImageUrlFromSession: () => {
    return sessionStorage.getItem("profileImageUrl");
  },

  /**
   * Saves the profile image URL to session storage.
   *
   * @function setProfileImageUrlToSession
   * @param {string} url - The URL of the profile image to be saved.
   */
  setProfileImageUrlToSession: (url) => {
    sessionStorage.setItem("profileImageUrl", url);
  },

  /**
   * Retrieves data from session storage.
   *
   * @function getSessionData
   * @param {string} key - The key for the session storage item.
   * @returns {Object|null} The parsed object from session storage if available, otherwise null.
   */
  getSessionData: (key) => {
    const data = sessionStorage.getItem(key);
    if (data === "undefined" || !data) {
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
  setSessionData: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  /**
   * Updates the workout count for the user in session storage.
   *
   * @function updateWorkoutCount
   * @param {number} newCount - The new workout count to set.
   */
  updateWorkoutCount: (newCount) => {
    const user = AuthService.getUser();
    if (user) {
      user.workoutCount = newCount;
      AuthService.setUserSession(user, AuthService.getToken());
    }
  },

  /**
   * Increments the workout count for the user in session storage.
   *
   * @function incrementWorkoutCount
   */
  incrementWorkoutCount: () => {
    const user = AuthService.getUser();
    if (user) {
      user.workoutCount = (user.workoutCount || 0) + 1;
      AuthService.setUserSession(user, AuthService.getToken());
      console.log(`Workout count incremented to: ${user.workoutCount}`);
    }
  },

  /**
   * Decrements the workout count for the user in session storage.
   *
   * @function decrementWorkoutCount
   */
  decrementWorkoutCount: () => {
    const user = AuthService.getUser();
    if (user && user.workoutCount > 0) {
      user.workoutCount -= 1;
      AuthService.setUserSession(user, AuthService.getToken());
      console.log(`Workout count decremented to: ${user.workoutCount}`);
    } else {
      console.log(
        "Workout count could not be decremented (either user not found or workoutCount is already 0)."
      );
    }
  },
};

module.exports = AuthService;
