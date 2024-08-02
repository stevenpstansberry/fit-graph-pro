const registerService = require('./services/register')
const loginService = require('./services/login')
const verifyService = require('./services/verify')
const util = require('./utils/util')
const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

export const handler = async (event) => {
  console.log('Request Event: ', JSON.stringify(event, null, 2));
  let response;
  
  switch (true) {
    case event.httpMethod === 'GET' && event.path === healthPath:
      response = util.buildResponse(200, { message: 'Health check successful' });
      break;
    case event.httpMethod === 'POST' && event.path === registerPath:
        const registerBody = JSON.parse(event.body);

        response = await registerService.register(registerBody)
        //response = buildResponse(200, { message: 'Register successful' });
        break;

    case event.httpMethod === 'POST' && event.path === loginPath:
        const loginBody = JSON.parse(event.body);

        response = await loginService(loginBody);
        //response = util.buildResponse(200, { message: 'Login successful' });
        break;

    case event.httpMethod === 'POST' && event.path === verifyPath:
        response = util.buildResponse(200, { message: 'Verify successful' });
        break;

    default:
        console.error('No matching route found for:', event.httpMethod, event.path);
         response = util.buildResponse(404, { message: '404 Not Found' });
  }
  
  return response;
};


