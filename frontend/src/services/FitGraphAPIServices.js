/**
 * @fileoverview Service to interact with the FitGraph API.
 *
 * @file src/services/FitGraphAPIServices.js
 *
 * Provides functions to interact with various API endpoints, including retrieving,
 * creating, and deleting workouts and splits, as well as handling contact form submissions.
 *
 * Utilizes Axios for HTTP requests.
 *
 * @author Steven Stansberry
 * @version 1.0.0
 */

import axios from "axios";

// Base URL for the FitGraph production environment API
const fitGraphProd = process.env.REACT_APP_FIT_GRAPH_PROD;

/**
 * Sends a GET request to a specified API endpoint.
 *
 * @async
 * @function getFromAPI
 * @param {string} endpoint - The API endpoint to send the GET request to.
 * @param {function} [errorHandler] - Optional callback function to handle errors.
 * @returns {Promise<Object|null>} Response data from the API or handled value from the error handler.
 * @throws Will throw an error if the request fails and no errorHandler is provided.
 */
const getFromAPI = async (endpoint, errorHandler) => {
  const url = `${fitGraphProd}${endpoint}`; // Construct the full URL

  // Log the request details before making the request
  console.log("Making GET request to:", url);
  console.log("Request Headers:", {
    "Content-Type": "application/json",
  });

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.REACT_APP_FIT_GRAPH_PROD_KEY,
      },
    });

    // Log the response status and data
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    if (errorHandler) {
      return errorHandler(error); // Use the provided error handler
    }

    if (error.response) {
      // Request made and server responded
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      console.error("Request Error:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error", error.message);
    }
    throw error; // Re-throw the error after logging it
  }
};

/**
 * Sends a POST request to a specified API endpoint with data.
 *
 * @async
 * @function postToAPI
 * @param {string} endpoint - The API endpoint to send the POST request to.
 * @param {Object} data - The data to be sent in the body of the POST request.
 * @param {function} [errorHandler] - Optional callback function to handle errors.
 * @returns {Promise<Object|null>} Response data from the API or handled value from the error handler.
 * @throws Will throw an error if the request fails and no errorHandler is provided.
 */
const postToAPI = async (endpoint, data, errorHandler) => {
  const url = `${fitGraphProd}${endpoint}`; // Construct the full URL

  // Log the request details before making the request
  console.log("Making POST request to:", url);
  console.log("Request Data:", data);
  console.log("Request Headers:", {
    "Content-Type": "application/json",
  });

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.REACT_APP_FIT_GRAPH_PROD_KEY,
      },
    });

    // Log the response status and data
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    if (errorHandler) {
      return errorHandler(error); // Use the provided error handler
    }

    if (error.response) {
      // Request made and server responded
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      console.error("Request Error:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error", error.message);
    }
    throw error; // Re-throw the error after logging it
  }
};

/**
 * Sends a DELETE request to a specified API endpoint with optional data.
 *
 * @async
 * @function deleteToAPI
 * @param {string} endpoint - The API endpoint to send the DELETE request to.
 * @param {Object} [data] - Optional data to include in the DELETE request.
 * @param {function} [errorHandler] - Optional callback function to handle errors.
 * @returns {Promise<Object|null>} Response data from the API or handled value from the error handler.
 * @throws Will throw an error if the request fails and no errorHandler is provided.
 */
const deleteToAPI = async (endpoint, data = {}, errorHandler) => {
  const url = `${fitGraphProd}${endpoint}`; // Construct the full URL

  // Log the request details before making the request
  console.log("Making DELETE request to:", url);
  console.log("Request Data:", data); // Log the request data
  console.log("Request Headers:", {
    "Content-Type": "application/json",
  });

  try {
    const response = await axios.delete(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.REACT_APP_FIT_GRAPH_PROD_KEY,
      },
      data: data, // Include the optional data in the request
    });

    // Log the response status and data
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    if (errorHandler) {
      return errorHandler(error); // Use the provided error handler
    }

    if (error.response) {
      // Request made and server responded
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      console.error("Request Error:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error", error.message);
    }
    throw error; // Re-throw the error after logging it
  }
};

/**
 * Sends a PUT request to a specified API endpoint with data.
 *
 * @async
 * @function putToAPI
 * @param {string} endpoint - The API endpoint to send the PUT request to.
 * @param {Object} data - The data to be sent in the body of the PUT request.
 * @param {function} [errorHandler] - Optional callback function to handle errors.
 * @returns {Promise<Object|null>} Response data from the API or handled value from the error handler.
 * @throws Will throw an error if the request fails and no errorHandler is provided.
 */
const putToAPI = async (endpoint, data, errorHandler) => {
  const url = `${fitGraphProd}${endpoint}`; // Construct the full URL

  // Log the request details before making the request
  console.log("Making PUT request to:", url);
  console.log("Request Data:", data);
  console.log("Request Headers:", {
    "Content-Type": "application/json",
  });

  try {
    const response = await axios.put(url, data, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.REACT_APP_FIT_GRAPH_PROD_KEY,
      },
    });

    // Log the response status and data
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error) {
    if (errorHandler) {
      return errorHandler(error); // Use the provided error handler
    }

    if (error.response) {
      // Request made and server responded
      console.error("Response Error:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      console.error("Request Error:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error", error.message);
    }
    throw error; // Re-throw the error after logging it
  }
};

/**
 * Uploads a new workout to the API.
 *
 * @async
 * @function uploadWorkout
 * @param {Object} workout - The workout data to upload.
 * @returns {Promise<Object>} Response data from the API.
 */
export const uploadWorkout = async (workout) => {
  return postToAPI("/workouts/create", workout);
};

/**
 * Uploads a new workout split to the API.
 *
 * @async
 * @function uploadSplit
 * @param {Object} split - The split data to upload.
 * @returns {Promise<Object>} Response data from the API.
 */
export const uploadSplit = async (split) => {
  return postToAPI("/splits/create", split);
};

/**
 * Deletes a workout from the API.
 *
 * @async
 * @function deleteWorkout
 * @param {Object} workout - The workout object to delete, which includes workout details.
 * @returns {Promise<Object>} Response data from the API.
 */
export const deleteWorkout = async (workout) => {
  return deleteToAPI(`/workouts/delete/${workout.workoutId}`, workout);
};

/**
 * Deletes a workout split from the API.
 *
 * @async
 * @function deleteSplit
 * @param {string} splitId - The ID of the split to delete.
 * @returns {Promise<Object>} Response data from the API.
 */
export const deleteSplit = async (splitId) => {
  return deleteToAPI(`/splits/delete/${splitId}`);
};

/**
 * Retrieves all workouts for a specific user from the API.
 * Optionally allows filtering by days or by the number of recent workouts.
 *
 * @async
 * @function getAllWorkouts
 * @param {string} username - The username to retrieve workouts for.
 * @param {Object} [options] - Optional parameters for filtering.
 * @param {number} [options.days] - Number of days to look back to filter workouts.
 * @param {number} [options.count] - Number of recent workouts to retrieve.
 * @returns {Promise<Object|string>} Response data from the API, or a message if no workouts are found.
 * @throws Will throw an error if the request fails.
 */
export const getAllWorkouts = async (username, options = {}) => {
  const { days, count } = options; // Destructure options parameter
  let endpoint = `/workouts/all/${username}`;

  // Construct query parameters based on the options provided
  const queryParams = new URLSearchParams();
  if (days) queryParams.append("days", days);
  if (count) queryParams.append("count", count);

  // Append query parameters to the endpoint if any are present
  if (queryParams.toString()) {
    endpoint += `?${queryParams.toString()}`;
  }

  // Define custom error handling for workout retrieval
  const handleWorkoutError = (error) => {
    if (error.response && error.response.status === 410) {
      console.log(`${username} has no workouts`);
      return `${username} has no workouts`;
    }
    throw error; // Rethrow other errors
  };

  return getFromAPI(endpoint, handleWorkoutError);
};

/**
 * Retrieves all workout splits for a specific user from the API.
 *
 * @async
 * @function getAllSplits
 * @param {string} username - The username to retrieve splits for.
 * @returns {Promise<Object|string>} Response data from the API, or a message if no splits are found.
 */
export const getAllSplits = async (username) => {
  const handleSplitError = (error) => {
    if (error.response && error.response.status === 410) {
      console.log(`${username} has no workout splits`);
      return `${username} has no workout splits`;
    }
    throw error;
  };

  return getFromAPI(`/splits/all/${username}`, handleSplitError);
};

/**
 * Submits a contact form to the API for processing.
 *
 * @async
 * @function submitContactForm
 * @param {Object} formData - The data from the contact form.
 * @param {string} formData.name - The name of the person submitting the form.
 * @param {string} formData.email - The email address of the person submitting the form.
 * @param {string} formData.message - The message from the contact form.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
export const submitContactForm = async (formData) => {
  return postToAPI("/contact", formData);
};

/**
 * Uploads a profile picture to the API.
 *
 * @async
 * @function uploadProfilePicture
 * @param {string} base64ProfilePictureString - The Base64-encoded string of the profile picture.
 * @returns {Promise<Object>} Response data from the API.
 */
export const uploadProfilePicture = async (base64ProfilePictureString) => {
  return postToAPI("/profile/upload-picture", base64ProfilePictureString);
};

/**
 * Retrieves a user's profile picture URL from the API.
 *
 * @async
 * @function getProfilePicture
 * @param {string} username - The username to retrieve the profile picture for.
 * @returns {Promise<Object|null>} Response data containing the profile picture URL, or null if not found.
 */
export const getProfilePicture = async (username) => {
  let endpoint = `/profile/${username}`;

  // Define custom error handling for profile picture retrieval
  const handleProfilePictureError = (error) => {
    if (error.response && error.response.status === 410) {
      // No Profile Picture found
      console.log("No profile picture found");
      return null;
    }
    throw error;
  };

  return getFromAPI(endpoint, handleProfilePictureError);
};

/**
 * Logs in a user by sending their credentials to the API.
 *
 * @async
 * @function loginUser
 * @param {Object} credentials - The login credentials.
 * @param {string} credentials.username - The username of the user.
 * @param {string} credentials.password - The password of the user.
 * @returns {Promise<Object>} Response data from the API containing the user and token.
 * @throws Will throw an error if the request fails.
 */
export const loginUser = async (credentials) => {
  return postToAPI("/login", credentials);
};

/**
 * Registers a new user to the API.
 *
 * @async
 * @function registerUser
 * @param {Object} userDetails - The registration details including username, email, name, and password.
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
export const registerUser = async (userDetails) => {
  return postToAPI("/register", userDetails);
};

/**
 * Sends a password reset request to the API.
 *
 * @async
 * @function requestPasswordReset
 * @param {Object} credentials - The user credentials to request a password reset.
 * @param {string} credentials.email - The user's email address.
 * @param {string} mode - The mode for the password reset request ("ForgotPassword" or "ResetPassword").
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
export const requestPasswordReset = async (credentials, mode) => {
  // Ensure that the mode is included in the request payload
  const payload = {
    ...credentials,
    mode, // Include the mode in the payload
  };

  // Send the request to the API
  return postToAPI("/password-reset", payload);
};

/**
 * Sends a manual password reset request to the API.
 *
 * @async
 * @function UserPasswordReset
 * @param {Object} credentials - The users new credentials .
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.username - The user's username.
 * @param {string} credentials.password - The user's new password.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
export const UserPasswordReset = async (credentials) => {
  return postToAPI("/password-reset/manual", credentials);
};

/**
 * Verifies the user's current password by sending the email and password to the API.
 *
 * @async
 * @function verifyPassword
 * @param {Object} credentials - The user credentials to verify.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.username - The user's username.
 * @param {string} credentials.password - The user's current password.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
export const verifyPassword = async (credentials) => {
  return postToAPI("/verify-password", credentials);
};

/**
 * Verifies the user token by sending a request to the API.
 *
 * @async
 * @function verifyToken
 * @param {Object} user - The user object containing username and token.
 * @param {string} user.username - The username of the user.
 * @param {string} user.token - The token to be verified.
 * @returns {Promise<Object>} Response data from the API containing the user and token.
 * @throws Will throw an error if the request fails.
 */
export const verifyToken = async (user) => {
  return postToAPI("/verify", user);
};

/**
 * Predicts future performance based on the user's workout history and goals.
 *
 * @async
 * @function calculateFuturePerformance
 * @param {Object} performanceData - The data required for future performance calculation.
 * @param {string} performanceData.username - The username of the user.
 * @param {string} performanceData.exercise - The exercise for which to calculate future performance.
 * @param {number} performanceData.goalWeight - The target weight the user wants to achieve.
 * @param {Array} performanceData.workoutHistory - Array of workout objects containing the user's workout history.
 * @returns {Promise<Object>} Response data from the API containing the predicted performance data.
 * @throws Will throw an error if the request fails.
 */
export const calculateFuturePerformance = async (performanceData) => {
  return postToAPI("/calculateFuturePerformance", performanceData);
};

/**
 * Updates a workout by sending a PUT request to the API.
 *
 * @async
 * @function updateWorkout
 * @param {string} workoutToEditId - The ID of the workout to update.
 * @param {Object} workoutData - The updated workout data to send.
 * @param {function} [errorHandler] - Optional callback function to handle errors.
 * @returns {Promise<Object|null>} Response data from the API or handled value from the error handler.
 */
export const updateWorkout = async (
  workoutToEditId,
  workoutData,
  errorHandler
) => {
  const endpoint = `/workouts/edit/${workoutToEditId}`;
  return await putToAPI(endpoint, workoutData, errorHandler);
};

/**
 * Updates a workout split by sending a PUT request to the API.
 *
 * @async
 * @function updateSplit
 * @param {string} splitToEditId - The ID of the split to update.
 * @param {Object} splitData - The updated split data to send.
 * @param {function} [errorHandler] - Optional callback function to handle errors.
 * @returns {Promise<Object|null>} Response data from the API or handled value from the error handler.
 */
export const updateSplit = async (splitToEditId, splitData, errorHandler) => {
  const endpoint = `/splits/edit/${splitToEditId}`;
  return await putToAPI(endpoint, splitData, errorHandler);
};

/**
 * Deletes a user from the API.
 *
 * @async
 * @function deleteUser
 * @param {Object} credentials - The user credentials for account deletion.
 * @param {string} credentials.username - The username of the user.
 * @param {string} credentials.password - The password of the user.
 * @returns {Promise<Object>} Response data from the API indicating success or failure of the deletion.
 * @throws Will throw an error if the request fails.
 */
export const deleteUser = async (credentials) => {
  return deleteToAPI("/delete", credentials);
};
