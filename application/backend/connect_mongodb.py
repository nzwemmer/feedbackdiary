from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import os

# MongoDB connection URI (default settings and localhost)
# Authentication enabled.
username = path = os.environ['MDB_USER']
password = path = os.environ['MDB_PASS']

uri = f"mongodb://{username}:{password}@localhost:27017"

db_name = "feedbackdiary"


def establish_connection():
    try:
        # Connect to the MongoDB server
        client = MongoClient(
            uri, serverSelectionTimeoutMS=10, connectTimeoutMS=20000)

        # Select the database
        db = client[db_name]

        # Perform any database operations here
        col_courses = db["courses"]
        col_teachers = db["teachers"]
        return col_courses, col_teachers

    except ServerSelectionTimeoutError:
        return None
