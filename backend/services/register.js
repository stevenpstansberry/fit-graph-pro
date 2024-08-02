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
    if (!username || !name || !email || !password){
        return util.buildResponse(401, {
            message: 'All fields are required.'
        });
    }

    const dynamoUser = await getUser(username.toLowerCase().trim);
    if (dynamoUser && dynamoUser.username){
        return util.buildResponse(401, {
            message: 'username already taken.'
        })
    }

    const encryptedPassword = bcrypt.hashSync(password.trim(), 10);
    const user = {
        name : name,
        email : email,
        username : username.toLowerCase().trim,
        password: encryptedPassword
    }

    const saveUserResponse = await saveUser(user);
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
        console.error('Error occured', error)
    }
)
}