const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
})
const util = require('../utils/util');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fit-graph-users';
const bcrypt = require('bcryptjs');

async function register(userInfo){
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;
    
    // Check to see if all fields are included
    if (!username || !name || !email || !password){
        return util.buildResponse(401, {
            message: 'All fields are required.'
        });
    }

    // Get the user 
    const dynamoUser = await getUser(username.toLowerCase().trim);

    // Check to see if user with same username exists 
    if (dynamoUser && dynamoUser.username){
        return util.buildResponse(401, {
            message: 'username already taken.'
        })
    }

    // Encrypt password and create user object
    const encryptedPassword = bcrypt.hashSync(password.trim(), 10);
    const user = {
        name : name,
        email : email,
        username : username.toLowerCase().trim,
        password: encryptedPassword
    }
    // Save the user to DynamoDB and retrieve the response of the operation
    const saveUserResponse = await saveUser(user);

    // Check to see if response exists 
    if(!saveUserResponse){
        return util.buildResponse(503,{
            message: 'server error, please try again later'
        })
    }
    return util.buildResponse(200, {username : username})
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
);
}

async function saveUser(user){
    const params = {
        TableName: userTable,
        Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error('Error occured getting user', error)
    }
);
}

module.exports.register = register;