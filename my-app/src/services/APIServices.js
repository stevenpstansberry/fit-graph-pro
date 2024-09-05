/**
 * @fileoverview Service to interact with the FitGraph API.
 * 
 * @file src/services/APIServices.js
 * 
 * Provides functions to interact with various API endpoints, including retrieving,
 * creating, and deleting workouts and splits, as well as handling contact form submissions.
 * 
 * Utilizes Axios for HTTP requests.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

import axios from 'axios';

// Base URL for the FitGraph production environment API
const fitGraphProd = process.env.REACT_APP_FIT_GRAPH_PROD;

/**
 * Sends a GET request to a specified API endpoint.
 * 
 * @async
 * @function getFromAPI
 * @param {string} endpoint - The API endpoint to send the GET request to.
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
const getFromAPI = async (endpoint) => {
  try {
    const url = `${fitGraphProd}${endpoint}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error getting from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Sends a POST request to a specified API endpoint with data.
 * 
 * @async
 * @function postToAPI
 * @param {string} endpoint - The API endpoint to send the POST request to.
 * @param {Object} data - The data to be sent in the body of the POST request.
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
const postToAPI = async (endpoint, data) => {
  const url = `${fitGraphProd}${endpoint}`; // Construct the full URL
  
  // Log the request details before making the request
  console.log('Making POST request to:', url);
  console.log('Request Data:', data);
  console.log('Request Headers:', {
    'Content-Type': 'application/json', 
    'X-Api-Key': process.env.REACT_APP_FIT_GRAPH_PROD_KEY, 
  });

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json', 
        'X-Api-Key': process.env.REACT_APP_FIT_GRAPH_PROD_KEY, 
      },
    });
    
    // Log the response status and data
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      console.error('Response Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      console.error('Request Error:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error', error.message);
    }
    throw error; // Re-throw the error after logging it
  }
};



/**
 * Sends a DELETE request to a specified API endpoint.
 * 
 * @async
 * @function deleteToAPI
 * @param {string} endpoint - The API endpoint to send the DELETE request to.
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
const deleteToAPI = async (endpoint) => {
  try {
    const url = `${fitGraphProd}${endpoint}`;
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    console.error(`Error deleting from ${endpoint}:`, error);
    throw error;
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
  return postToAPI('/workouts/create', workout);
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
  return postToAPI('/splits/create', split);
};

/**
 * Deletes a workout from the API.
 * 
 * @async
 * @function deleteWorkout
 * @param {string} workoutId - The ID of the workout to delete.
 * @returns {Promise<Object>} Response data from the API.
 */
export const deleteWorkout = async (workoutId) => {
  return deleteToAPI(`/workouts/delete/${workoutId}`);
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
 * @returns {Promise<Object>} Response data from the API.
 * @throws Will throw an error if the request fails.
 */
export const getAllWorkouts = async (username, options = {}) => {
  const { days, count } = options; // Destructure options parameter
  let endpoint = `/workouts/all/${username}`;

  // Construct query parameters based on the options provided
  const queryParams = new URLSearchParams();
  if (days) queryParams.append('days', days);
  if (count) queryParams.append('count', count);

  // Append query parameters to the endpoint if any are present
  if (queryParams.toString()) {
    endpoint += `?${queryParams.toString()}`;
  }

  return getFromAPI(endpoint);
};


/**
 * Retrieves all workout splits for a specific user from the API.
 * 
 * @async
 * @function getAllSplits
 * @param {string} username - The username to retrieve splits for.
 * @returns {Promise<Object>} Response data from the API.
 */
export const getAllSplits = async (username) => {
  return getFromAPI(`/splits/all/${username}`);
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
  return postToAPI('/contact', formData);
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
  return postToAPI('/profile/upload-picture', base64ProfilePictureString);
}

/**
 * Retrieves a user's profile picture URL from the API.
 * 
 * @async
 * @function getProfilePicture
 * @param {string} username - The username to retrieve the profile picture for.
 * @returns {Promise<Object>} Response data containing the profile picture URL.
 */
export const getProfilePicture = async(username) => {
  let endpoint = `/profile/${username}`;
  return getFromAPI(endpoint);
}