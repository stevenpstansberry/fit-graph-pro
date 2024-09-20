


import axios from 'axios';


const exerciseDBBaseURL = 'https://exercisedb.p.rapidapi.com';
const exerciseDBApiKey = process.env.REACT_APP_EXERCISE_DB_KEY;



/**
 * Retrieves information for a specific exercise from the ExerciseDB API.
 *
 * @async
 * @function getExerciseInfo
 * @param {string} exerciseName - The name of the exercise to retrieve information for.
 * @returns {Promise<Object>} Response data from the ExerciseDB API containing exercise details.
 * @throws Will throw an error if the request fails.
 */
export const getExerciseInfo = async (exerciseName) => {
    // Construct the full URL for the API endpoint
    const url = `${exerciseDBBaseURL}/exercises/name/${exerciseName}`;
  
    // Log the request details before making the request
    console.log('Making GET request to:', url);
    console.log('Request Headers:', {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      'X-RapidAPI-Key': exerciseDBApiKey,
    });
  
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          'X-RapidAPI-Key': exerciseDBApiKey,
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
 * Retrieves all exercises from the ExerciseDB API.
 *
 * @async
 * @function getAllExercises
 * @returns {Promise<Object[]>} Response data from the ExerciseDB API containing all exercises.
 * @throws Will throw an error if the request fails.
 */
export const getAllExercises = async () => {
  try {
    // Construct the full URL for the API endpoint with the limit parameter set to 0 to retrieve all exercises
    const url = `${exerciseDBBaseURL}/exercises?limit=0`;

    // Log the request details before making the request
    console.log('Making GET request to:', url);
    console.log('Request Headers:', {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      'X-RapidAPI-Key': exerciseDBApiKey,
    });

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        'X-RapidAPI-Key': exerciseDBApiKey,
      },
    });

    // Log the response status and data
    console.log('Response Status:', response.status);
    console.log('Response Data Length:', response.data.length);

    return response.data; // Return all exercises
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