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
const common = require('./common');


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
    const dynamoUser = await common.getUser(userTable, username.toLowerCase().trim());
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
        {
          displayLabel: "Barbell Bench Press",
          displayBodyPart: "Chest",
          label: "barbell bench press",
          muscles: ["chest", "triceps"],
          sets: [{}, {}, {}],
          bodyPart: "chest"
        },
        {
          displayLabel: "Lever Military Press",
          displayBodyPart: "Shoulders",
          label: "lever military press",
          muscles: ["triceps"],
          sets: [{}, {}, {}],
          bodyPart: "shoulders"
        },
        {
          displayLabel: "Cable Pushdown",
          displayBodyPart: "Upper Arms",
          label: "cable pushdown",
          muscles: ["triceps", "forearm"],
          sets: [{}, {}, {}],
          bodyPart: "upper arms"
        },
        {
          displayLabel: "Dumbbell Lateral Raise",
          displayBodyPart: "Shoulders",
          label: "dumbbell lateral raise",
          muscles: ["trapezius"],
          sets: [{}, {}, {}],
          bodyPart: "shoulders"
        }
      ]      
    },
    {
      name: "Pull Day",
      exercises: [
        {
          displayLabel: "Barbell Deadlift",
          displayBodyPart: "Upper Legs",
          label: "barbell deadlift",
          muscles: ["gluteal", "hamstring", "lower-back"],
          sets: [{}, {}, {}],
          bodyPart: "upper legs"
        },
        {
          displayLabel: "Pull Up (neutral Grip)",
          displayBodyPart: "Back",
          label: "pull up (neutral grip)",
          muscles: ["biceps", "forearm"],
          sets: [{}, {}, {}],
          bodyPart: "back"
        },
        {
          displayLabel: "Barbell Bent Over Row",
          displayBodyPart: "Back",
          label: "barbell bent over row",
          muscles: ["upper-back", "biceps", "forearm"],
          sets: [{}, {}, {}],
          bodyPart: "back"
        },
        {
          displayLabel: "Cable Hammer Curl (with Rope)",
          displayBodyPart: "Upper Arms",
          label: "cable hammer curl (with rope)",
          muscles: ["biceps", "forearm"],
          sets: [{}, {}, {}],
          bodyPart: "upper arms"
        }
      ]
    },
    {
      name: "Leg Day",
      exercises: [
        {
          displayLabel: "Barbell Full Squat (back Pov)",
          displayBodyPart: "Upper Legs",
          label: "barbell full squat (back pov)",
          muscles: ["gluteal", "quadriceps", "hamstring", "calves"],
          sets: [{}, {}, {}],
          bodyPart: "upper legs"
        },
        {
          displayLabel: "Barbell Romanian Deadlift",
          displayBodyPart: "Upper Legs",
          label: "barbell romanian deadlift",
          muscles: ["gluteal", "hamstring", "lower-back"],
          sets: [{}, {}, {}],
          bodyPart: "upper legs"
        },
        {
          displayLabel: "Lever Seated Squat Calf Raise On Leg Press Machine",
          displayBodyPart: "Lower Legs",
          label: "lever seated squat calf raise on leg press machine",
          muscles: ["calves", "quadriceps", "hamstring", "gluteal"],
          sets: [{}, {}, {}],
          bodyPart: "lower legs"
        },
        {
          displayLabel: "Barbell Floor Calf Raise",
          displayBodyPart: "Lower Legs",
          label: "barbell floor calf raise",
          muscles: ["calves", "hamstring"],
          sets: [{}, {}, {}],
          bodyPart: "lower legs"
        }
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