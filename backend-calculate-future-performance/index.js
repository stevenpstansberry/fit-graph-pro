const Regression = require('ml-regression').SimpleLinearRegression;

/**
 * Parse the workout history to extract data points for the specified exercise.
 * 
 * @param {Array} workoutHistory - The list of workout sessions.
 * @param {string} exercise - The exercise label to filter on.
 * @returns {Object} - An object containing dates and weights arrays.
 */
function parseWorkoutHistory(workoutHistory, exercise) {
    const dates = [];
    const weights = [];

    workoutHistory.forEach(workout => {
        const workoutDate = new Date(workout.date);
        workout.exercises.forEach(ex => {
            if (ex.label === exercise) {
                ex.sets.forEach(set => {
                    const weight = parseFloat(set.weight);
                    dates.push(workoutDate);
                    weights.push(weight);
                });
            }
        });
    });

    return { dates, weights };
}

/**
 * Predict when the user will achieve the goal weight using linear regression.
 * 
 * @param {Array} dates - Dates of past workouts.
 * @param {Array} weights - Weights lifted in those workouts.
 * @param {number} goalWeight - The target weight for the goal.
 * @returns {string} - Predicted date when the goal weight will be achieved.
 */
function predictGoalAchievement(dates, weights, goalWeight) {
    // Convert dates to days since the first workout
    const startDate = Math.min(...dates);
    const daysSinceStart = dates.map(date => (date - startDate) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    // Perform linear regression
    const regression = new Regression(daysSinceStart, weights);

    // Predict the number of days needed to reach the goal weight
    const targetDays = regression.predict(goalWeight);


    // Calculate the estimated goal achievement date
    const predictedDate = new Date(startDate + targetDays * 24 * 60 * 60 * 1000);
    return predictedDate.toISOString().split('T')[0];
}

/**
 * Lambda handler function to predict future performance.
 * 
 * @param {Object} event - The event object containing request data.
 * @param {Object} context - The context object (not used here).
 * @returns {Object} - Response object with status code and predicted date or error message.
 */
exports.handler = async (event) => {
    try {
        // Parse request body

        const body = JSON.parse(event.body);

        // Extract parameters from request
        const { exercise, goalWeight, workoutHistory } = body;

        // Process workout history and perform prediction
        const { dates, weights } = parseWorkoutHistory(workoutHistory, exercise);
        if (!dates.length || !weights.length) {
            return buildResponse(400, { error: 'No data found for the specified exercise.' });
        }

        const predictedDate = predictGoalAchievement(dates, weights, goalWeight);

        // Return the predicted date in the response
        return buildResponse(200, { predictedDate });

    } catch (error) {
        return buildResponse(500, { error: error.message });
    }
};

/**
 * Builds a standardized HTTP response for AWS Lambda functions.
 * 
 * @function buildResponse
 * @param {number} statusCode - The HTTP status code of the response.
 * @param {Object} body - The body of the response.
 * @returns {Object} The formatted HTTP response object with headers.
 * 
 * @description
 * This function creates a standardized HTTP response object for AWS Lambda functions
 * that integrates with API Gateway. It includes CORS headers to allow cross-origin
 * requests, supporting a variety of HTTP methods and headers.
 */
function buildResponse(statusCode, body) {
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
        'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
  }