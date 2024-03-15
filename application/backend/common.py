from datetime import datetime, timedelta
import random
import json
import re
# TODO: Delete me after finishing.
def generate_random_data(start_date_str, end_date_str):
    data = {}

    # Convert start_date_str and end_date_str to datetime objects
    start_date = datetime.strptime(start_date_str, "%d/%m/%Y")
    end_date = datetime.strptime(end_date_str, "%d/%m/%Y") + timedelta(days=1)  # Add one day to include the end date

    current_date = start_date
    while current_date < end_date:
        for hour in range(0, 24):
            timestamp = f"{current_date.day:02d}/{current_date.month:02d}/{current_date.year} {hour:02d}:00"
            # Generate a random value, but ensure that each day has at least one data point (set to 0 if not randomized)
            value = random.randint(1, 50) if random.random() > 0.1 else 0
            data[timestamp] = value

        current_date += timedelta(days=1)  # Move to the next day

    return data


def process_json_file(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    sentiment_data = {
        "negative": {},
        "neutral": {},
        "positive": {},
        "very negative": {},
        "very positive": {}
    }

    for entry in data:
        sentiment = entry["sentiment"]
        date_added = entry["date"]
        formatted_date = datetime.strptime(date_added, "%Y-%m-%d %H:%M:%S").strftime("%d/%m/%Y %H:%M")

        if sentiment == -1:
            sentiment_category = "negative"
        elif sentiment == 0:
            sentiment_category = "neutral"
        elif sentiment == 1:
            sentiment_category = "positive"
        elif sentiment == -2:
            sentiment_category = "very negative"
        elif sentiment == 2:
            sentiment_category = "very positive"
        else:
            sentiment_category = "neutral"  # Entries with unknown sentiment are considered neutral.
            # continue  # Skip entries with unknown sentiment

        if formatted_date not in sentiment_data[sentiment_category]:
            sentiment_data[sentiment_category][formatted_date] = 1
        else:
            sentiment_data[sentiment_category][formatted_date] += 1

    result_data = {
        "negative": {date: sentiment_data["negative"].get(date, 0) for date in sentiment_data["negative"]},
        "neutral": {date: sentiment_data["neutral"].get(date, 0) for date in sentiment_data["neutral"]},
        "positive": {date: sentiment_data["positive"].get(date, 0) for date in sentiment_data["positive"]},
        "very negative": {date: sentiment_data["very negative"].get(date, 0) for date in sentiment_data["very negative"]},
        "very positive": {date: sentiment_data["very positive"].get(date, 0) for date in sentiment_data["very positive"]}
    }

    return result_data

def format_human_readable_date(input_datetime):
    now = datetime.now()

    # Calculate the time difference
    time_difference = now - input_datetime

    # If the date is today
    if input_datetime.date() == now.date():
        if time_difference.total_seconds() < 60:
            return "Just now"
        elif time_difference.total_seconds() < 3600:
            minutes = int(time_difference.total_seconds() / 60)
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return f"Today at {input_datetime.strftime('%H:%M')}"

    # If the date is not today
    elif time_difference.total_seconds() < 86400:
        return f"Yesterday at {input_datetime.strftime('%H:%M')}"

    # If the date is more than one day ago
    else:
        return input_datetime.strftime("%Y-%m-%d %H:%M:%S")

def date_between_range(startDate, currentDate, endDate):
    # Parse the date strings into datetime objects, assuming a common year (e.g., 2023)
    start = datetime.strptime(startDate, "%d/%m/%Y")
    current = datetime.strptime(currentDate.split()[0], "%d/%m/%Y")
    end = datetime.strptime(endDate, "%d/%m/%Y")
    
    # Compare the datetime objects
    return start <= current <= end

def store_json(save_path, data):
    with open(save_path, 'w') as json_file:
        json.dump(data, json_file)

def read_json(save_path):
    with open(save_path, 'r') as json_file:
        return json.load(json_file)


# Function to check password strength
def is_strong_password(password):
    # Check for at least 8 characters, a combination of letters, numbers, and at least one special character
    return re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$', password) is not None