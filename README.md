# FitGraphPro

FitGraphPro is a serverless fitness tracking application that allows users to track their fitness activities, set goals, and visualize their progress with dynamic, interactive graphs. The app includes OAuth authentication, real-time data updates, and personalized insights.

## Features

- OAuth 2.0 authentication (Google, Facebook, Apple)
- Real-time fitness activity logging
- Dynamic graphs for data visualization (D3.js, Chart.js, Plotly.js)
- Personalized workout recommendations (Amazon SageMaker)
- Gamification with badges and achievements
- Integration with fitness trackers (Fitbit, Apple Watch)
- Augmented reality (AR) workout guides
- Social features for challenges and leaderboards

## Technologies Used

- **Frontend**: React.js, React Native, D3.js, Chart.js
- **Backend**: AWS Lambda, API Gateway, DynamoDB, S3
- **Real-time Data**: AWS Kinesis, WebSockets
- **Authentication**: OAuth 2.0 with AWS Cognito/Auth0
- **Monitoring**: AWS CloudWatch, AWS X-Ray
- **CI/CD**: AWS CodePipeline, AWS CodeBuild

## Getting Started

### Prerequisites

- Node.js and npm
- AWS CLI configured
- Auth0 or AWS Cognito account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fit-graph-pro.git
   cd fit-graph-pro
   ```
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

## Usage

Running the Frontend

1. Start the development server:
   ```bash
   cd frontend
    npm start
   ```
2. Open your browser and navigate to http://localhost:3000.
