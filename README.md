# Workout Tracker Web App

A fully-featured workout tracking static web application built with React, Material UI, and AWS cloud services. This app allows users to log their workouts, visualize their progress over time, and predict future performance based on past data. The back-end is powered by AWS, with secure user authentication implemented using JWT.

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
- **Performance Prediction**: Predict future workout performance using a linear regression model based on your historical data.
- **User Authentication**: Secure user authentication using JSON Web Tokens (JWT).
- **Cloud-Backed**: Serverless architecture with AWS Lambda, DynamoDB, and API Gateway for scalability and cost-effectiveness.

## Tech Stack
### Front-End:
- **React**: JavaScript framework for building the user interface.
- **React-Jest**: Testing suite built for React.
- **Material UI**: UI component library for sleek and responsive designs.
  
### Back-End:
- **AWS Lambda**: Serverless functions to handle backend logic and API endpoints.
- **API Gateway**: To expose RESTful APIs and manage requests.
- **DynamoDB**: NoSQL database for storing user data and workout logs.
- **JWT Authentication**: Secure authentication flow using JSON Web Tokens handled via AWS Lambda and API Gateway.
- **Amazon S3**: Scaleable and durable storage. Used to host webssite and manage profile pictures

### Other Tools:
- **AWS SDK**: To interact with AWS services.
- **Axios**: For handling HTTP requests from the front-end.
- **Recharts**: For graph visualization.

## Architecture

This app uses a **serverless architecture** built on AWS, making it highly scalable and cost-efficient. Here's a high-level overview:

1. **React Front-End**:
   - A single-page application (SPA) built with React and Material UI for responsiveness and ease of use.
   - Interacts with the back-end via HTTP requests to AWS API Gateway.

2. **AWS API Gateway**:
   - Exposes RESTful API endpoints to handle requests such as logging workouts, retrieving workout history, and user authentication.

3. **AWS Lambda**:
   - Serverless functions to handle business logic, such as processing workout data, authenticating users, and interfacing with DynamoDB.

4. **DynamoDB**:
   - A NoSQL database that stores user workout data and authentication tokens securely.

5. **JWT Authentication**:
   - Ensures secure login and session management by generating and validating JWT tokens.
  
## Setup and Installation
- **Node.js** installed on your machine.
- AWS account with access to **Lambda, API Gateway, and DynamoDB**.
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
1. Nobile App via React Native
2. Social Features
3. Enhanced prediction models
4. Achievements / gamification system

## License
This project is licensed under the MIT License. See the LICENSE file for details
