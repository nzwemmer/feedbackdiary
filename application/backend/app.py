import os
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import re
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, get_jwt_identity, \
    unset_jwt_cookies, jwt_required, JWTManager
from application.ai.utility import count_recurring
from application.ai.utility import sentiment_analysis
from application.ai.utility import summary

import connect_mongodb
from common import *
import connect_diary_dashboard
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
import random
import string
from bson.objectid import ObjectId
from pathlib import Path
from flask_sslify import SSLify

app = Flask(__name__)
bcrypt = Bcrypt(app)
mail = Mail(app)  # instantiate the mail class

app.config['MAIL_SERVER'] = 'live.smtp.mailtrap.io'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'api'
app.config['MAIL_PASSWORD'] = os.environ['MAIL_PASS']
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

sslify = SSLify(app)

CORS(app, resources={
     r'/api/*': {'origins': '*', 'supports_credentials': True}})


@app.route('/api/login', methods=['POST'])
def login_user():
    _, col_teachers = connect_mongodb.establish_connection()

    email = request.json.get("email", None).lower()
    password = request.json.get("password", None)

    # Query the MongoDB collection for the teacher with the provided email
    teacher = col_teachers.find_one({"email": email})
    if not teacher:
        return {"msg": "Teacher not found"}, 404

    if bcrypt.check_password_hash(teacher["password"], password):
        # Password is correct; generate an access token
        access_token = create_access_token(identity=email)
        return {"msg": "Credentials accepted!", "access_token": access_token}, 200
    else:
        return {"msg": "Wrong email or password"}, 401


@app.route("/api/register", methods=["POST"])
def register():
    course_tokens = request.json.get("course_token", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    password_verify = request.json.get("password_verify", None)

    # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return {"msg": "Invalid email format"}, 400

    # Check user input errors.
    if password != password_verify:
        return {"msg": "Passwords do not match"}, 401
    elif not is_strong_password(password):
        return {"msg": "Passwords need to be at least 8 characters and a combination of letters, numbers, and at least one special character"}, 401

    # Connect to the database.
    col_courses, col_teachers = connect_mongodb.establish_connection()
    course_list = []

    # See if the teacher already exists.
    teacher = col_teachers.find_one({"email": email})
    if teacher:
        # Try to log in teacher with provided passwords.
        if bcrypt.check_password_hash(teacher["password"], password):
            # Initiate the courses list with current courses.
            course_list = teacher["courses"]
        else:
            return {"msg": "You already own an account, and the password is incorrect."}, 403
    else:
        # Hash the password for adding later.
        pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Add courses to either new or existing teacher.
    for course_token in course_tokens.split(";"):
        course = col_courses.find_one({"token": course_token})

        # Check database error.
        if course:
            course_id = ObjectId(course["_id"])
            if course_id not in course_list:
                course_list.append(course_id)
        else:
            return {"msg": f"Incorrect course token: {course_token}"}, 401

    if teacher:
        # Update teacher "courses" value.
        updated_teacher = col_teachers.update_one(
            {"email": email},
            {"$set": {"courses": course_list}}
        )

        if updated_teacher.modified_count == 1:
            access_token = create_access_token(identity=email)
            return {"msg": "Available course(s) updated! Logging in...", "access_token": access_token}
        else:
            return {"msg": "There was an error adding the new courses. Maybe you already had access? Please try again later."}, 500
    else:
        # Create a new teacher in case it did not exist yet.
        new_teacher = {
            "email": email,
            "password": pw_hash,
            "courses": course_list
        }
        inserted_document = col_teachers.insert_one(new_teacher)

        # Get the ID of the inserted document
        inserted_document_id = inserted_document.inserted_id
        if inserted_document_id:
            access_token = create_access_token(identity=email)
            return {"msg": "You are now registered! Logging in...", "access_token": access_token}
        else:
            return {"msg": "There was an error. Please try again later."}, 500


@app.route('/api/changepasswordrequest', methods=['POST'])
def change_password_request():
    _, col_teachers = connect_mongodb.establish_connection()

    # Get the email address from the request JSON
    email = request.json.get("email", None)

    # Check if the email exists in the database
    teacher = col_teachers.find_one({"email": email})
    if not teacher:
        return {"msg": "Email not found"}, 404

    # Generate a random reset token (you can customize this)
    reset_token = ''.join(random.choices(
        string.ascii_letters + string.digits, k=32))

    # Store the reset token in the teacher document in the database
    col_teachers.update_one(
        {"email": email}, {"$set": {"reset_token": reset_token}})

    # Load the HTML template file
    with open("reset_password_email_template.html", "r") as template_file:
        template_content = template_file.read()

    # Replace placeholders with actual content
    reset_link = f'https://teacher.feedbackdiary.nl/changepassword/{reset_token}/{email}'
    email_content = render_template_string(
        template_content, reset_link=reset_link)

    msg = Message('Password Reset',
                  sender='no-reply@feedbackdiary.nl', recipients=[email])
    msg.html = email_content

    # Send the email
    try:
        mail.send(msg)
        return {"msg": "Password reset email sent successfully"}
    except Exception as e:
        return {"msg": "Failed to send email"}, 500


@app.route('/api/changepassword', methods=['POST'])
def reset_password():
    _, col_teachers = connect_mongodb.establish_connection()

    # Get the reset token and new password from the request JSON
    reset_token = request.json.get("reset_token", None)
    email = request.json.get("email", None)
    new_password = request.json.get("password", None)
    new_password_verify = request.json.get("password_verify", None)

    if not new_password == new_password_verify:
        return {"msg": "Passwords did not match."}, 401
    elif not is_strong_password(new_password):
        return {"msg": "Passwords need to be at least 8 characters and a combination of letters, numbers, and at least one special character"}, 401

    # Check if the reset token exists in the database
    teacher = col_teachers.find_one({
        "$and": [
            {"reset_token": reset_token},
            {"email": email}
        ]
    })

    if not teacher:
        return {"msg": "Invalid or expired reset token, or email does not match."}, 400

    # Update the password in the teacher's document
    col_teachers.update_one({"_id": teacher["_id"]}, {"$set": {
                            "password": bcrypt.generate_password_hash(new_password).decode('utf-8')}})

    # Clear the reset token
    col_teachers.update_one({"_id": teacher["_id"]}, {
                            "$unset": {"reset_token": ""}})
    access_token = create_access_token(identity=email)

    return {"msg": "Password reset successful!", "access_token": access_token}, 200


@app.route("/api/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route("/api/load/courses", methods=["GET"])
@jwt_required()
def load_courses():
    col_courses, col_teachers = connect_mongodb.establish_connection()

    # Get the user's email from the JWT
    email = get_jwt_identity()

    # Query the MongoDB database to find courses associated with the user's email
    teacher_data = col_teachers.find_one({"email": email})

    # Extract the list of course IDs associated with the teacher's account
    course_ids = teacher_data.get("courses", [])

    # Convert course IDs to ObjectId
    course_ids = [ObjectId(course_id) for course_id in course_ids]

    # Query the courses collection to get course names based on the course IDs
    courses = col_courses.find({"_id": {"$in": course_ids}})

    # Extract the course names
    course_list = {"courses": {course["name"]: [
        course["start_date"], course["end_date"]] for course in courses}}

    # Return the list of course names as JSON
    return jsonify(course_list)


@app.route('/api/load/sentiment/overtime', methods=['POST'])
@jwt_required()
def get_sentiment_over_time():
    request_data = request.get_json()
    course = request_data.get('selectedCourse')
    start_date = request_data.get('formattedStartDate')
    end_date = request_data.get('formattedEndDate')

    if not course:
        return {"error": "Course not provided!"}, 200
    elif not start_date:
        return {"error": "Start date not provided!"}, 200
    elif not end_date:
        return {"error": "End date not provided!"}, 200

    # Create a new dictionary for summarized data
    summarized_dataset = {}

    # Parse start_date and end_date strings to datetime objects
    start_datetime = datetime.strptime(start_date, "%d/%m/%Y")
    end_datetime = datetime.strptime(end_date, "%d/%m/%Y")

    # Get the data from the messages file, based on which course was parsed.
    dataset = process_json_file(f'../data/{course}/entries.json')

    start_and_end_equal = False
    time_filter = "%d/%m/%Y"

    # Check if start_date and end_date are equal
    if start_datetime == end_datetime:
        start_and_end_equal = True
        time_filter = "%d/%m/%Y %H"
        end_datetime = end_datetime.strftime("%d/%m/%Y 23:59")
        end_datetime = datetime.strptime(end_datetime, "%d/%m/%Y %H:%M")

    for category, timestamps in dataset.items():
        summarized_timestamps = {}
        current_datetime = start_datetime

        while current_datetime <= end_datetime:
            truncated_timestamp = current_datetime.strftime(time_filter)

            if start_and_end_equal:
                # Add the timestamps with hours and minutes included.
                summarized_timestamps[f"{truncated_timestamp}:00"] = sum(
                    count for timestamp, count in timestamps.items() if timestamp.startswith(truncated_timestamp))
                current_datetime += timedelta(hours=1)
            else:
                # Add the timestamps with hours and minutes excluded.
                summarized_timestamps[truncated_timestamp] = sum(
                    count for timestamp, count in timestamps.items() if timestamp.startswith(truncated_timestamp))
                current_datetime += timedelta(days=1)

        summarized_dataset[category] = summarized_timestamps

    # Calculate the sum for the "combined" category
    combined_sum = sum(sum(summaries.values())
                       for summaries in summarized_dataset.values())
    summarized_dataset["combined"] = combined_sum

    return summarized_dataset


@app.route('/api/load/labels', methods=['POST', 'PUT'])
@jwt_required()
def handle_labels():
    request_data = request.get_json()
    course = request_data.get('course')

    if not course:
        return {"error": "Course not provided!"}, 200

    save_path = f"../data/{course}/counter.json"

    if request.method == 'POST' and os.path.exists(save_path):
        counter = read_json(save_path)
        # Sanity check if the data retrieved is a properly formatted file. It should have a key of "English" in it.
        if "english" in counter:
            return jsonify(counter)

    # If method is PUT or the file doesn't exist, run the logic to generate and save new data
    student_path = f"../data/{course}/students.xlsx"
    teacher_path = f"../data/{course}/teachers.xlsx"
    message_path = f"../data/{course}/entries.json"
    counters, _ = count_recurring.count_recurring(
        course, student_path, teacher_path, message_path, overwrite=True)
    languages = ["english", "dutch"]
    message_types = ["positive", "negative", "additional", "combined"]

    # Use a nested dictionary comprehension to create the counter dictionary
    counter = {
        language: {
            message_type: count_recurring.get_counter(
                language, message_type, counters, 5)
            for message_type in message_types
        }
        for language in languages
    }

    # Save the counter dictionary to a JSON file
    store_json(save_path, counter)
    # If the file exists and the method is POST, read and return its content

    return jsonify(counter)


@app.route('/api/download/entries', methods=['POST'])
@jwt_required()
def download_all_data():
    results = connect_diary_dashboard.download_entries()

    try:
        for course, entries in results.items():
            save_path = f"../data/{course}/entries.json"  # 8: to trim https://
            file = Path(save_path)
            file.parent.mkdir(parents=True, exist_ok=True)
            store_json(save_path, entries)

        return {"msg": "Download complete."}
    except Exception as e:
        return {"msg": "Failed to download. Please try again later."}


@app.route('/api/load/sentiment', methods=['POST', 'PUT'])
@jwt_required()
def get_sentiment():
    overwrite = False
    # Verbose is false for API call, can be set to True for debugging.
    verbose = False
    arguments = request.get_json()

    # arguments["course"] is the course abbreviation, agruments["type"] is student/ai argument.
    if arguments and "course" in arguments and "type" in arguments:
        course = arguments["course"]
        sentiment_type = arguments["type"]
    else:
        return {"error": "Course argument not provided."}, 200

    data_path = f"../data/{course}"
    read_paths = [f"{data_path}/{path}" for path in ["students.xlsx",
                                                     "teachers.xlsx", "entries.json"]]
    store_paths = [f"{data_path}/{path}" for path in [
        "sentiment_student.json", "sentiment_ai.json", "accuracy.json"]]

    ai = True if sentiment_type == 'AI' and request.method == 'PUT' else False
    overwrite = True if request.method == 'PUT' else False

    student_sentiment, ai_sentiment, accuracy, modify_date_student, modify_date_ai = sentiment_analysis.run_sentiment_analysis(
        course, read_paths, store_paths, ai, verbose, overwrite)

    data = student_sentiment if sentiment_type == "Student" else ai_sentiment

    modify_date_student = format_human_readable_date(modify_date_student)
    modify_date_ai = format_human_readable_date(modify_date_ai)

    return jsonify({"data": data, "accuracy": accuracy, "modify_date_student": modify_date_student, "modify_date_ai": modify_date_ai})


@app.route('/api/load/summary', methods=['POST', 'PUT'])
@jwt_required()
def get_summary():
    arguments = request.get_json()

    if arguments and "course" in arguments:
        course = arguments["course"]
        read_path = f"../data/{course}/messages_filtered.json"
        store_path = f"../data/{course}/summary.json"
        overwrite = True if request.method == 'PUT' else False

        summaries, modify_date = summary.run_truncated(
            read_path, store_path, overwrite=overwrite)

        return {"data": summaries, "modify_date": format_human_readable_date(modify_date)}
    else:
        return {"error": "Course argument not provided."}, 400


if __name__ == '__main__':
    # app.run(ssl_context=('../.cert/cert.pem', '../.cert/key.pem'), debug=True, port=12345, host="0.0.0.0")
    app.run(debug=True, port=12345, host="0.0.0.0")
