/**
 * @fileoverview Main entry point for the backend API handler. 
 * This file is responsible for handling all API request routing
 * and determining which service to invoke based on the request path and method.
 * 
 * @file backend/index.js
 * 
 * Handles routes for user registration, login, workout and split creation, and data retrieval ...
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

// Import required service modules
const registerService = require('./services/register');
const loginService = require('./services/login');
const verifyService = require('./services/verify');
const getWorkoutByIdService = require ('./services/getWorkout');
const getAllWorkoutsService = require ('./services/getAllWorkouts');
const getAllSplitsService = require ('./services/getAllSplits');
const createWorkoutService = require ('./services/createWorkout');
const createSplitService = require ('./services/createSplit');
const deleteWorkoutService = require ('./services/deleteWorkout');
const deleteSplitService = require ('./services/deleteSplit');
const util = require('./utils/util');

// Define API paths
const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const getAllWorkoutsPath = '/workouts/all';
const getAllSplitsPath = '/splits/all';
const createWorkoutPath = '/workouts/create';
const createSplitPath = '/splits/create';
const deleteWorkoutPath = '/workouts/delete';
const deleteSplitPath = '/splits/delete';

let username;

/**
 * AWS Lambda handler for processing API requests.
 * @param {Object} event - The incoming API Gateway request event.
 * @returns {Object} - API Gateway-compatible HTTP response.
 */
exports.handler = async (event) => {
    console.log('Request Event: ', event); // Log the event


    let response;
    switch(true) {
        // Health check route to verify server is running
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;

        // User registration route
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;

        // User login route            
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        
        // Verify user token route
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = verifyService.verify(verifyBody);
            break;

        // Retrieve all workouts route
        case event.httpMethod ==='GET' && event.path === getAllWorkoutsPath:
            response = await getAllWorkoutsService.getAllWorkouts();
            break;

        // Retrieve workouts for a specified user route
        case event.httpMethod === 'GET' && event.path.startsWith(getAllWorkoutsPath + '/'):
            username = event.path.split('/').pop();
            response = await getAllWorkoutsService.getAllWorkoutsForUser(username);
            break;
        
        // Retrieve workout by workout ID route
        case event.httpMethod === 'GET' && event.path.startsWith('/workouts/') && event.pathParameters && event.pathParameters.workoutid:
            const workoutId = event.pathParameters.workoutid;
            response = await getWorkoutByIdService.getWorkoutById(workoutId);
            break;
         
        // Retrieve all workout splits route           
        case event.httpMethod ==='GET' && event.path === getAllSplitsPath:
            response = await getAllSplitsService.getAllSplits();
            break;       

        // Retrieve splits for a specific user route    
        case event.httpMethod === 'GET' && event.path.startsWith(getAllSplitsPath + '/'):
            username = event.path.split('/').pop();
            response = await getAllSplitsService.getSplitsForUser(username);
            break;      

        // Create a new workout route    
        case event.httpMethod === 'POST' && event.path === createWorkoutPath:
            const createWorkoutBody = JSON.parse(event.body)
            response = createWorkoutService.uploadWorkout(createWorkoutBody);
            break;

        // Create a new split path    
        case event.httpMethod === 'POST' && event.path === createSplitPath:
            const createSplitBody = JSON.parse(event.body);
            response = createSplitService.uploadSplit(createSplitBody);
            break;    

        // Delete a workout by workout ID route
        case event.httpMethod === 'DELETE' && event.path.startsWith(deleteWorkoutPath + '/'):
            const workoutIdToDelete = event.path.split('/').pop(); 
            response = await deleteWorkoutService.deleteWorkout(workoutIdToDelete);
            break;

        // Delete a split by split ID route
        case event.httpMethod === 'DELETE' && event.path.startsWith(deleteSplitPath + '/'):
            const splitIdToDelete = event.path.split('/').pop(); 
            response = util.buildResponse(200, {message : 'delete split method reached'})
            //response = await deleteSplitService.deleteSplit(splitIdToDelete);
            break;
        
        // Default - All other routes
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};