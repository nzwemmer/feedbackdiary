import json
# from textblob import TextBlob  # Import TextBlob for sentiment analysis
import pandas as pd
import os
from application.ai.privacy.remove_names import remove_names_from_message


def read_text(path="data/text.txt"):
    lines = []

    with open(path, "r") as file:
        for line in file:
            if not line[0] == "#":
                lines.append(line.strip())
    return lines


def read_json_messages(course, student_path, teacher_path, message_path, overwrite=False, return_entries=False, verbose=False):
    # For returning entries, we need to only filter out the unneccessary information but
    # we still want to compare sentiment for each of the entries, complete with pos/neg/add messages including parsed sentiment.

    data_dir = f"{os.path.expanduser('~')}/feedbackdiary/application/data"

    if return_entries:
        read_path = os.path.join(data_dir, course, "messages_filtered.json")
    # The alternative here is for the counters. The counters only consider the exact pos/neg/add messages.
    else:
        read_path = os.path.join(data_dir, course, "messages_sorted.json")

    if os.path.exists(read_path) and not overwrite:
        if verbose:
            print("Skipping recalculate...")

        with open(read_path, 'r') as json_file:
            return json.load(json_file)

    # Load JSON data from the file
    with open(message_path, 'r') as json_file:
        messages = json.load(json_file)

    # Create list of student names and teacher names which we want filtered.
    student_names = extract_names_from_excel(student_path)
    teacher_names = extract_names_from_excel(teacher_path)
    names = student_names + teacher_names

    # Initialize lists to store student-provided sentiment, positive, negative, and additional messages
    sentiments = []
    positive_messages = []
    negative_messages = []
    additional_messages = []

    entries_filtered = []

    # Iterate through each message
    for entry in messages:
        sentiment = entry["sentiment"]
        positive_message = entry["message_positive"]
        negative_message = entry["message_negative"]
        additional_message = entry["message_additional"]

        # Remove names from the messages.
        positive_message = remove_names_from_message(positive_message, names)
        negative_message = remove_names_from_message(negative_message, names)
        additional_message = remove_names_from_message(
            additional_message, names)

        # If a request to the reader was done for sentiment analysis, make sure it is stored for processing later.
        if return_entries:
            entries_filtered.append({"positive": positive_message, "negative": negative_message,
                                    "additional": additional_message, "sentiment": sentiment})
        else:
            # Append sentiment to its list of sentiments.
            sentiments.append(sentiment)

            # Add the messages to their respective list.
            positive_messages.append(positive_message)
            negative_messages.append(negative_message)

            # if "_none" not in additional_message:
            additional_messages.append(additional_message)

    if return_entries:
        # Save the output of the filtered entries separate to a file for sentiment analysis.
        with open(read_path, 'w') as output_file:
            json.dump({
                "entries": entries_filtered
            }, output_file)
        return read_json_full(read_path)
    else:
        # Save the output of the filtered and sorted outputs to a file for counting.
        with open(read_path, 'w') as output_file:
            json.dump({
                "positive": positive_messages,
                "negative": negative_messages,
                "additional": additional_messages,
                "sentiment": sentiments
            }, output_file)
        return read_json_full(read_path)


def read_json_full(path="../data/entries.json"):
    with open(path, 'r') as json_file:
        data = json.load(json_file)
    return data


def extract_names_from_excel(excel_file_path='data/students.xlsx'):
    df = pd.read_excel(excel_file_path)

    if 'FirstName' in df.columns and 'LastName' in df.columns:
        combined_names = (df['FirstName'] + ' ' +
                          df['LastName']).str.lower().tolist()
        return combined_names
    else:
        # TODO: Nice exception.
        return []
