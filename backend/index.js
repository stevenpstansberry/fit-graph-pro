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
const registerService = require('./services/auth-services/register');
const loginService = require('./services/auth-services/login');
const verifyService = require('./services/verify');
const contactService = require('./services/contactService');
const getWorkoutByIdService = require ('./services/workout-services/getWorkout');
const getAllWorkoutsService = require ('./services/workout-services/getAllWorkouts');
const getAllSplitsService = require ('./services/split-services/getAllSplits');
const createWorkoutService = require ('./services/workout-services/createWorkout');
const createSplitService = require ('./services/split-services/createSplit');
const deleteWorkoutService = require ('./services/workout-services/deleteWorkout');
const deleteSplitService = require ('./services/split-services/deleteSplit');
const uploadProfilePictureService = require('./services/uploadProfilePicture');
const getProfilePictureService = require ('./services/getProfilePicture');
const PasswordResetService = require ('./services/auth-services/PasswordReset');
const ManualPasswordResetService = require ('./services/auth-services/ManualPasswordReset');
const VerifyPasswordService = require ('./services/auth-services/VerifyPassword');
const EditWorkoutService = require ('./services/workout-services/editWorkout');
const EditSplitService = require ('./services/split-services/editSplit');
const deleteAccountService = require ('./services/auth-services/deleteAccount');
const util = require('./utils/util');

// Define API paths
const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const contactPath = '/contact';
const getAllWorkoutsPath = '/workouts/all';
const getAllSplitsPath = '/splits/all';
const createWorkoutPath = '/workouts/create';
const createSplitPath = '/splits/create';
const deleteWorkoutPath = '/workouts/delete';
const deleteSplitPath = '/splits/delete';
const uploadProfilePicturePath = '/profile/upload-picture';
const getProfilePicturePath = '/profile'
const PasswordResetPath = '/password-reset'
const ManualPasswordResetPath = '/password-reset/manual';
const VerifyPasswordPath = '/verify-password';
const editWorkoutPath = '/workouts/edit';
const editSplitsPath = '/splits/edit'
const deleteAccountPath = '/delete';



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

        // Contact us route
        case event.httpMethod === 'POST' && event.path === contactPath:
            //const contactBody = JSON.parse(event.body);
            response = contactService.sendContactEmail(event);
            break;

        // Retrieve all workouts route
        case event.httpMethod ==='GET' && event.path === getAllWorkoutsPath:
            response = await getAllWorkoutsService.getAllWorkouts();
            break;

        // Retrieve workouts for a specified user route with query parameters
        case event.httpMethod === 'GET' && event.path.startsWith(getAllWorkoutsPath + '/'):
            username = event.path.split('/').pop();

            // Parse query parameters
            const { days, count } = event.queryStringParameters || {};

            if (days) {
                // If 'days' parameter is provided, fetch workouts from the past set amount of days
                response = await getAllWorkoutsService.getWorkoutsForUserByDays(username, parseInt(days, 10));
                //response = util.buildResponse(200, {message: 'days reached'});
            } else if (count) {
                // If 'count' parameter is provided, fetch the last count amount of workouts
                response = await getAllWorkoutsService.getRecentWorkoutsForUser(username, parseInt(count, 10));
                //response = util.buildResponse(200, {message: 'count reached'});

            } else {
                // Default case: fetch all workouts for the user
                response = await getAllWorkoutsService.getAllWorkoutsForUser(username);
            }
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
            response = await deleteSplitService.deleteSplit(splitIdToDelete);
            break;
            
        // Upload profile picture route
        case event.httpMethod === 'POST' && event.path === uploadProfilePicturePath:
            //response = util.buildResponse(200, {message: 'profile picture method reached'});
            response = await uploadProfilePictureService.uploadProfilePicture(event);
            break;

        // Retrieve profile picture route
        case event.httpMethod === 'GET' && event.path.startsWith(getProfilePicturePath + '/'):
            username = event.path.split('/').pop();
            response = await getProfilePictureService.getProfilePicture(username);   
            break;

        // Password Reset Route
        case event.httpMethod === 'POST' && event.path === PasswordResetPath:
            response = await PasswordResetService.resetPassword(event);
            break;    

        // Manual Password Reset Route
        case event.httpMethod === 'POST' && event.path === ManualPasswordResetPath:
            response = await ManualPasswordResetService.manualPasswordReset(event);
            break;    

        // Password Verify Route
        case event.httpMethod === 'POST' && event.path === VerifyPasswordPath:
            const verifyPasswordBody = JSON.parse(event.body);
            response = await VerifyPasswordService.verifyPassword(verifyPasswordBody);
            break;      

        // Edit a workout route
        case event.httpMethod === 'PUT' && event.path.startsWith(editWorkoutPath + '/'):
            const editWorkoutBody = JSON.parse(event.body)
            response = await EditWorkoutService.editWorkout(editWorkoutBody);
            response = util.buildResponse(200, {message : editWorkoutBody});
            break;    

        // Edit a split route
        case event.httpMethod === 'PUT' && event.path.startsWith(editSplitsPath + '/'):
            const editSplitBody = JSON.parse(event.body)
            response = await EditSplitService.editSplit(editSplitBody);
            break;    

        // Delete user account route
        case event.httpMethod === 'DELETE' && event.path === deleteAccountPath:
            const deleteAccountBody = JSON.parse(event.body);
            console.log("EVENT BODY:" + deleteAccount);
            response = await deleteAccountService.deleteAccount(deleteAccountBody);
            //response = util.buildResponse(200, {message: 'Delete user method reached'});
            break;    
            
            
        // Default - All other routes
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};