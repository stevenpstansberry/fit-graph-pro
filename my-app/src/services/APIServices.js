// src/services/APIServices.js
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

const deleteToAPI = async (endpoint, data) => {
  console.log ("Delete request: ", data)
  try {
    const url = `${fitGraphProd}${endpoint}`;
    const response = await axios.delete(url, data);
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

export const deleteWorkout = async (workoutId) => {
  return deleteToAPI(`/workouts/delete/${workoutId}`)
}
