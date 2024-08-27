// APIService.js
import axios from 'axios';

const fitGraphProd = process.env.REACT_APP_FIT_GRAPH_PROD;

const postToAPI = async (endpoint, data) => {
  try {
    const url = `${fitGraphProd}${endpoint}`;
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
};

export const uploadWorkout = async (workout) => {
  return postToAPI('/workouts/create', workout);
};

export const uploadSplit = async (split) => {
  return postToAPI('/splits/create', split);
};
