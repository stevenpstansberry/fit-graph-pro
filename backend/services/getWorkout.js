const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const workoutTable = 'fit-graph-user-workouts';

async function getWorkoutById(workoutId){
    const params = {
        TableName : workoutTable,
        Key: {
            workoutId : workoutId
        }
    };
    return await dynamodb.get(params).promise().then( response => {
        return response.Item;
    }, error => {
        console.log('error', error);
    })
}

module.exports.getWorkoutById = getWorkoutById