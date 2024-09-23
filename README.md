# Fit Graph Pro

## Project Overview

A fully-featured **workout tracking web application** built using **React**, **Material UI**, and a **serverless architecture** powered by **AWS cloud services**. The application enables users to log workouts, visualize their progress through interactive graphs as well as body heatmap which will emphasize areas of the body worked by the user's logged exercises. Users are also able to predict future performance using a **linear regression model** based on historical data.

The back-end leverages **RESTful APIs** hosted via **AWS API Gateway** to handle requests, with serverless logic managed by **AWS Lambda**. **User authentication** is securely implemented using **JWT (JSON Web Tokens)**, with the authentication flow handled through **AWS Lambda** and **API Gateway**, ensuring secure access to user data. The app also integrates third-party services like the **ExerciseDB API** to fetch and display comprehensive exercise information.

The application's data is stored in **DynamoDB**, a scalable NoSQL database, and user-generated content, such as workouts and splits. The entire app is deployed using **AWS Route 53** for DNS management and hosted on **Amazon S3** for static file serving. A **CI/CD pipeline** is integrated using **AWS CodePipeline** with testing managed by the **React-Jest** test suite, ensuring continuous deployment and smooth integration of new features.


## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup and Installation](#setup-and-installation)
- [Future Improvements](#future-improvements)
- [License](#license)

## Demo
Check out the live demo: [Link to demo]()

## Features
- **Workout Tracking**: Log and track your workouts, including sets, reps, and weights.
- **Data Visualization**: Visualize your workout progress with interactive graphs.
- **Heat Map**: See your workout intensity or frequency over time with a heat map.
- **Performance Prediction**: Predict future workout performance using a linear regression model based on your historical data. Utulizes Epley's 1 Rep Max formula for calculating 1 rep max.
- **User Authentication**: Secure user authentication using JSON Web Tokens (JWT).
- **Cloud-Backed**: Serverless architecture with AWS Lambda, DynamoDB, and API Gateway for scalability and cost-effectiveness.

## Tech Stack
### Front-End:
- **React**: JavaScript framework for building the user interface.
- **React-Jest**: Testing suite built for React.
- **Material UI**: UI component library for sleek and responsive designs.
  
### Back-End:
- **AWS Lambda**: Serverless functions to handle backend logic, powered by **Node.js** for efficient and scalable execution of JavaScript.
- **API Gateway**: To expose RESTful APIs and manage requests.
- **JWT Authentication**: Secure authentication flow using JSON Web Tokens handled via **Node.js** in AWS Lambda and API Gateway.
- **DynamoDB**: NoSQL database for storing user data and workout logs.
- **Amazon S3**: Scalable and durable storage used to host the website and manage profile pictures.


- ## Key Libraries/Dependencies/ Tools
- **AWS SDK**: To interact with AWS services.
- **Axios**: For handling HTTP requests from the front-end.
- **Recharts**: For graph visualization.  
- **React-Router-Dom**: For handling SPA routing and navigation.
- **Framer Motion**: For creating smooth animations and transitions.
- **React Beautiful DnD**: For implementing drag-and-drop functionality.
- **exerciseDB API**: A public API used for fetching exercise data such as descriptions, videos, and workout tips.
- **React Body Highlighter**: For interactive body muscle tracking and highlighting in workout-related interfaces (credits to **[react-body-highlighter](https://github.com/giavinh79/react-body-highlighter)**).

## Architecture

This app uses a **serverless architecture** built on AWS, making it highly scalable and cost-efficient. Here's a high-level overview:

- **React Front-End**:
   - A multi-page application (SPA) built with React and Material UI for responsiveness and ease of use.
   - Interacts with the back-end via HTTP requests to AWS API Gateway.

- **AWS API Gateway**:
   - Exposes RESTful API endpoints to handle requests such as logging workouts, retrieving workout history, user authentication, and other operations.

- **AWS Lambda**:
   - Serverless functions to handle business logic, such as processing workout data, authenticating users, and interfacing with DynamoDB.
   - Handles password reset functionality by generating unique reset pages with tokens and expiry dates.

- **DynamoDB**:
   - A NoSQL database that securely stores user workout data, authentication tokens, and other application data.

- **Amazon Simple Notification Service (SNS)**:
   - Utilized to handle the **Contact Page**, where users can send messages to the author. These messages are pushed to the author via SNS notifications.

- **Amazon Simple Email Service (SES)**:
   - Powers the fully-fledged **password reset system**. SES is used to send password reset emails containing a unique link for each user. Each link includes a **reset token** and **expiry date**, ensuring secure password recovery.

- **JWT Authentication**:
   - Ensures secure login and session management by generating and validating **JWT tokens**, managed via AWS Lambda and API Gateway.
 
## Testing and CI/CD Pipeline
### Automated Testing with Jest:

The app employs Jest for unit testing and component testing, ensuring that critical parts of the application function as expected.
The Jest test suite covers both front-end components and back-end logic to maintain high code quality.
CI/CD Integration with AWS CodePipeline:

The project integrates a CI/CD pipeline using AWS CodePipeline, which is triggered upon each pull request (PR) to GitHub.
Every approved PR triggers automated testing, where the Jest test suite runs to validate the new code changes. If all tests pass, the PR is merged, ensuring only thoroughly tested code reaches the production environment.
This pipeline guarantees a continuous deployment process, keeping the application stable and enabling smooth integration of new features.


  
## Setup and Installation
- **Node.js** installed on your machine.
- AWS account with IAM privileges for utulized services 
- **AWS CLI** or other means to configure AWS credentials.
  
### Clone the Repository

```bash
git clone https://github.com/stevenpstansberry/fit-graph-pro.git
cd fit-graph-pro
```

### Install Dependencies
``` bash
npm install
```

### Set up Environmnetal Variables
If you wish to obtain the neccessary API keys and other secrets please feel free to contact me!
If you already obtained such information, declare the following in your .env file within the frontend.
``` bash
REACT_APP_FIT_GRAPH_PROD=<your_api_gateway_url>
REACT_APP_FIT_GRAPH_PROD_KEY=<your_api_gateway_api_key>
REACT_APP_EXERCISE_DB_KEY=<your_exercise_db_key>
```

### Run the Application
Start the development server
``` bash
npm start
```
This will run the app locally at http://localhost:3000 by default

## Future Improvements
1. Mobile App via React Native
2. Social Features - friend system, share workouts, compete agaisnt friends
3. Achievements / gamification system - badges, milestones

## License
This project is licensed under the MIT License. See the LICENSE file for details


## Acknowledgments

This project uses **[react-body-highlighter](https://github.com/giavinh79/react-body-highlighter)** by [Giavinh79](https://github.com/giavinh79). This library provides an interactive body diagram for muscle tracking in fitness apps. Thank you!
