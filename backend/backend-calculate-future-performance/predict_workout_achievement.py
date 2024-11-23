import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

def parse_workout_history(workout_history, exercise):
    """
    Parse the workout history to extract dates and weights for a specific exercise.

    Parameters:
        workout_history (list): A list of workout sessions, each containing exercises and sets.
        exercise (str): The exercise label to filter on.

    Returns:
        tuple: A tuple containing two lists:
            - dates (list of datetime): Dates of the workouts.
            - weights (list of float): Corresponding weights lifted for the specified exercise.
    """
    dates = []
    weights = []

    # Iterate through each workout session
    for workout in workout_history:
        # Convert the workout date string to a datetime object
        workout_date = datetime.strptime(workout['date'], '%Y-%m-%d')
        
        # Look through exercises in the workout session
        for ex in workout['exercises']:
            # Check if the exercise matches the specified label
            if ex['label'] == exercise:
                # Extract weights from each set and associate with the workout date
                for set_data in ex['sets']:
                    weight = float(set_data['weight'])
                    dates.append(workout_date)
                    weights.append(weight)
                    
    return dates, weights

def predict_goal_achievement(dates, weights, goal_weight):
    """
    Predict the date when a target weight will be achieved using linear regression.

    Parameters:
        dates (list of datetime): List of workout dates.
        weights (list of float): Corresponding weights lifted on those dates.
        goal_weight (float): The target weight to achieve.

    Returns:
        str: Predicted date (in YYYY-MM-DD format) when the goal weight will be achieved.
    """
    # Find the earliest workout date to use as the reference point
    start_date = min(dates)
    
    # Convert workout dates into days since the reference date
    days_since_start = [(date - start_date).days for date in dates]

    # Prepare data for linear regression
    # X represents the independent variable (days), y represents the dependent variable (weights)
    X = np.array(days_since_start).reshape(-1, 1)  # Reshape for sklearn compatibility
    y = np.array(weights)
    
    # Train a linear regression model on the data
    model = LinearRegression().fit(X, y)

    # Calculate the number of days needed to reach the goal weight
    target_days = (goal_weight - model.intercept_) / model.coef_[0]

    # Calculate the corresponding date for the target weight
    predicted_date = start_date + timedelta(days=target_days)
    return predicted_date.strftime('%Y-%m-%d')

# Example usage
workout_history = [
    {'date': '2023-01-01', 'exercises': [{'label': 'Bench Press', 'sets': [{'weight': 50}, {'weight': 55}]}]},
    {'date': '2023-01-15', 'exercises': [{'label': 'Bench Press', 'sets': [{'weight': 60}]}]},
    {'date': '2023-02-01', 'exercises': [{'label': 'Bench Press', 'sets': [{'weight': 65}]}]}
]

exercise = "Bench Press"  # The exercise for which we want to make predictions
goal_weight = 80          # Target weight to predict when it will be achieved

# Parse workout history to extract dates and weights for the specific exercise
dates, weights = parse_workout_history(workout_history, exercise)

# Predict the date when the goal weight will be achieved
predicted_date = predict_goal_achievement(dates, weights, goal_weight)

# Print the predicted date
print(f"Predicted date to reach {goal_weight}kg: {predicted_date}")
