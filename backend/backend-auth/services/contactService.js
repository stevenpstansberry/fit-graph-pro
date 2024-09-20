/**
 * @fileoverview Service to handle contact form submissions via AWS Lambda.
 * 
 * @file backend/services/contactFormHandler.js
 * 
 * Exposes the `sendContactEmail()` function to process contact form submissions.
 * 
 * Uses AWS SNS to send an email containing the submitted form data.
 * 
 * @author Steven Stansberry
 * @version 1.0.0
 */

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1'
});

const sns = new AWS.SNS();

/**
 * Processes contact form submissions and sends an email using AWS SNS.
 * 
 * @async
 * @function sendContactEmail
 * @param {Object} event - The API Gateway event object containing the request data.
 * @param {string} event.body - The JSON stringified body of the request, containing form data.
 * @returns {Promise<Object>} Response object indicating success or failure.
 */
async function sendContactEmail(event) {
  let formData;
  
  // Ensure event.body is parsed correctly from JSON
  try {
    formData = JSON.parse(event.body); // Parse JSON string
  } catch (error) {
    console.error('Invalid JSON format in request body:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request format' }),
    };
  }

  const { name, email, message } = formData; // Destructure parsed formData

  // Validate input fields
  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'All fields (name, email, message) are required.' }),
    };
  }

  // Construct email content to be sent via SNS
  const emailParams = {
    Message: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    Subject: `Contact Form Submission from ${name}`,
    TopicArn: 'arn:aws:sns:us-east-1:244416824020:ContactFormTopic'
  };

  try {
    // Publish the message to the SNS topic
    await sns.publish(emailParams).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending contact email:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email' }),
    };
  }
}

module.exports = {
  sendContactEmail
};
