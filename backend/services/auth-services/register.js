/**
 * @fileoverview Service to handle user registration by saving new user data to DynamoDB.
 * 
 * @file backend/services/auth-services/register.js
 * 
 * Exposes the `register()` function to handle the creation of a new user.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */


const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
AWS.config.update({
  region: 'us-east-1'
});
const util = require('../../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../../utils/auth');
const createSplitService = require('../split-services/createSplit');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fit-graph-users';

/**
 * Registers a new user by storing their details in DynamoDB.
 * 
 * @async
 * @function register
 * @param {Object} userInfo - The user information for registration.
 * @param {string} userInfo.name - The name of the user.
 * @param {string} userInfo.email - The email of the user.
 * @param {string} userInfo.username - The username of the user.
 * @param {string} userInfo.password - The password of the user.
 * @returns {Promise<Object>} Response object indicating success or failure of registration.
 */
async function register(userInfo) {
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;

    // Check if all required fields are provided
    if (!username || !name || !email || !password) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        });
    }

    // Check if the username already exists in DynamoDB    
    const dynamoUser = await getUser(username.toLowerCase().trim());
    if (dynamoUser && dynamoUser.username) {
        return util.buildResponse(401, {
            message: 'Username already exists in our database. Please choose a different username.'
        });
    }

    // Encrypt the password before storing    
    const encryptedPW = bcrypt.hashSync(password.trim(), 10);
    
    // Initialize the user object with profilePictureURL set to null
    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPW,
        profilePictureUrl: null  // Set default profile picture URL to null
    };

    // Save the new user data to DynamoDB    
    const saveUserResponse = await saveUser(user);
    if (!saveUserResponse) {
        return util.buildResponse(503, { message: 'Server Error. Please try again later.' });
    }

    // Create default workout splits for the new user
    await createDefaultSplits(username.toLowerCase().trim());

    const token = auth.generateToken(userInfo);

    // Response object
    const response = {
        user: user,
        token: token
    };
    return util.buildResponse(200, response);
}

/**
 * Creates default workout splits for a new user and saves them to DynamoDB.
 * 
 * @async
 * @function createDefaultSplits
 * @param {string} username - The username of the new user.
 * @returns {Promise<void>}
 */
async function createDefaultSplits(username) {
  const splits = [
    {
      name: "Push Day",
      exercises: [
        { label: "Bench Press", bodyPart: "Chest", muscles: ["chest", "triceps", "front-deltoids"], sets: [{}, {}, {}] },
        { label: "Overhead Press", bodyPart: "Shoulders", muscles: ["front-deltoids", "triceps"], sets: [{}, {}, {}] },
        { label: "Dips", bodyPart: "Chest", muscles: ["chest", "triceps", "front-deltoids"], sets: [{}, {}, {}] },
        { label: "Side Lateral Raise", bodyPart: "Shoulders", muscles: ["back-deltoids", "front-deltoids"], sets: [{}, {}, {}, {}, {}] },
        { label: "Tricep Extension", bodyPart: "Arms", muscles: ["triceps"], sets: [{}, {}, {}] }
      ]
    },
    {
      name: "Pull Day",
      exercises: [
        { label: "Deadlift", bodyPart: "Back", muscles: ["lower-back", "hamstring", "gluteal", "trapezius"], sets: [{}, {}, {}] },
        { label: "Barbell Row", bodyPart: "Back", muscles: ["upper-back", "biceps", "lower-back", "trapezius"], sets: [{}, {}, {}] },
        { label: "Face Pull", bodyPart: "Back", muscles: ["upper-back", "trapezius", "rear-deltoids"], sets: [{}, {}, {}] },
        { label: "Hammer Curl", bodyPart: "Arms", muscles: ["biceps", "forearm"], sets: [{}, {}, {}] },
        { label: "Bicep Curl", bodyPart: "Arms", muscles: ["biceps"], sets: [{}, {}, {}] },
        { label: "Pull Up", bodyPart: "Back", muscles: ["upper-back", "biceps", "trapezius"], sets: [{}, {}, {}] }
      ]
    },
    {
      name: "Leg Day",
      exercises: [
        { label: "Squat", bodyPart: "Legs", muscles: ["quadriceps", "hamstring", "gluteal", "calves"], sets: [{}, {}, {}] },
        { label: "Bulgarian Split Squat", bodyPart: "Legs", muscles: ["quadriceps", "hamstring", "gluteal"], sets: [{}, {}, {}] },
        { label: "Leg Curl", bodyPart: "Legs", muscles: ["hamstring"], sets: [{}, {}, {}] },
        { label: "Calf Raise", bodyPart: "Legs", muscles: ["calves"], sets: [{}, {}, {}, {}] },
        { label: "Leg Press", bodyPart: "Legs", muscles: ["quadriceps", "gluteal"], sets: [{}, {}, {}] }
      ]
    }
  ];

  // Assign a unique splitId and save each split to DynamoDB
  for (const split of splits) {
    split.splitId = uuidv4(); // Generate a unique ID for each split
    split.username = username; // Associate the split with the user's username
    await createSplitService.uploadSplit(split);
  }
}

/**
 * Retrieves a user from DynamoDB based on the provided username.
 * 
 * @async
 * @function getUser
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
async function getUser(username) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    };

    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There is an error getting user: ', error);
    });
}

/**
 * Saves a new user to DynamoDB.
 * 
 * @async
 * @function saveUser
 * @param {Object} user - The user object containing user details to save.
 * @returns {Promise<boolean>} Returns true if the user is saved successfully, otherwise false.
 */
async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    };
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There is an error saving user: ', error);
        return false;
    });
}

module.exports.register = register;