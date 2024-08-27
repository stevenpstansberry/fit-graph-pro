const registerService = require('./services/register');
const loginService = require('./services/login');
const verifyService = require('./services/verify');
const getWorkoutByIdService = require ('./services/getWorkout');
const getAllWorkoutsService = require ('./services/getAllWorkouts');
const getAllSplitsService = require ('./services/getAllSplits');
const createWorkoutService = require ('./services/createWorkout');
const createSplitService = require ('./services/createSplit');
const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const getAllWorkoutsPath = '/workouts/all';
const getAllSplitsPath = '/splits/all';
const createWorkoutPath = '/workouts/create';
const createSplitPath = '/splits/create';

const getWorkoutByIdPath = '/workouts/{workoutId}';

let username;

exports.handler = async (event) => {
    console.log('Request Event: ', event);


    let response;
    switch(true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = verifyService.verify(verifyBody);
            break;
        case event.httpMethod ==='GET' && event.path === getAllWorkoutsPath:
            response = await getAllWorkoutsService.getAllWorkouts();
        case event.httpMethod === 'GET' && event.path.startsWith(getAllWorkoutsPath + '/'):
            username = event.path.split('/').pop();
            response = await getAllWorkoutsService.getAllWorkoutsForUser(username);
            break;
        case event.httpMethod === 'GET' && event.path.startsWith('/workouts/') && event.pathParameters && event.pathParameters.workoutid:
            const workoutId = event.pathParameters.workoutid;
            response = await getWorkoutByIdService.getWorkoutById(workoutId);
            break;
        case event.httpMethod ==='GET' && event.path === getAllSplitsPath:
            response = await getAllSplitsService.getAllSplits();
            break;       
        case event.httpMethod === 'GET' && event.path.startsWith(getAllSplitsPath + '/'):
            username = event.path.split('/').pop();
            response = await getAllSplitsService.getSplitsForUser(username);
            break;      
        case event.httpMethod === 'POST' && event.path === createWorkoutPath:
            const createWorkoutBody = JSON.parse(event.body);
            response = util.buildResponse(200, {message : createWorkoutBody})
            break;
        case event.httpMethod === 'POST' && event.path === createSplitPath:
            const createSplitBody = JSON.parse(event.body);
            response = util.buildResponse(200, {message : createSplitBody})
            break;                                      
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};