const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
})
const util = require('../utils/util');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fit-graph-users';
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth')


async function login(user){
    const username = user.username
    const password = user.password
    if (!user || !username || !password) {
        return util.buildResponse(401, {
            message : 'username and password are required to login'
        })
    }

    // Get the user 
    const dynamoUser = await getUser(username.toLowerCase().trim())

    // Check to see if user exists 
    if (!dynamoUser || !dynamoUser.username){
        return util.buildResponse(403, {
            message: 'user does not exist'
        })
    }    

    if (!bcrypt.compareSync(password, dynamoUser.password)){
        return util.buildResponse(403, {message : "password is incorrect."})
    
    }
    const userInfo = {
        username: dynamoUser.username,
        name: dynamoUser.name
    }

    const token = auth.generateToken(userInfo);
    const response = {
        user : userInfo,
        token: token
    }
    return util.buildResponse(200, response);
}

async function getUser(username){
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('Error occured getting user', error)
    }
)
}

async function saveUser(user){
    const params = {
        TableName: userTable,
        Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, console.error ('Error occured saving the user', error));
}

module.exports.login = login;