const registerService = require('./services/register');
const loginService = require('./services/login');
const verifyService = require('./services/verify');
const getWorkoutByIdService = require ('./services/getWorkout');
const getAllWorkoutsService = require ('./services/getAllWorkouts');
const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const getAllWorkoutsPath = '/workouts/all';

const getWorkoutByIdPath = '/workouts/{workoutId}';


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
            break;
        case event.httpMethod === 'GET' && event.path.startsWith('/workouts/'):
            const workoutId = event.pathParameters.workoutid;
            response = await getWorkoutByIdService.getWorkoutById(workoutId);

            break;
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};