const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

export const handler = async (event) => {
  console.log('Request Event: ', JSON.stringify(event, null, 2));
  let response;
  
  switch (true) {
    case event.httpMethod === 'GET' && event.path === healthPath:
      response = buildResponse(200, { message: 'Health check successful' });
      break;
    case event.httpMethod === 'POST' && event.path === registerPath:
      response = buildResponse(200, { message: 'Register successful' });
      break;
    case event.httpMethod === 'POST' && event.path === loginPath:
      response = buildResponse(200, { message: 'Login successful' });
      break;
    case event.httpMethod === 'POST' && event.path === verifyPath:
      response = buildResponse(200, { message: 'Verify successful' });
      break;
    default:
      console.error('No matching route found for:', event.httpMethod, event.path);
      response = buildResponse(404, { message: '404 Not Found' });
  }
  
  return response;
};

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}
