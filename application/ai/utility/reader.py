import json
import pandas as pd
import os
from application.ai.privacy.remove_names import remove_names_from_message


def read_json_messages(course, student_path, teacher_path, message_path, overwrite=False, return_entries=False, verbose=False):
    """
    Function that reads the student submissions and extract either a full list of all entries (return_entries True), 
    or a list of comments sorted by sentiment, and a list of all OES for each entry.
    """

    data_dir = f"{os.path.expanduser('~')}/feedbackdiary/application/data"

    if return_entries:
        read_path = os.path.join(data_dir, course, "messages_filtered.json")
    # The alternative here is for the counters. The counters only consider the exact pos/neg/add messages.
    else:
        read_path = os.path.join(data_dir, course, "messages_sorted.json")

    if os.path.exists(read_path) and not overwrite:
        if verbose:
            print("Skipping refiltering...")

        return read_json_full(read_path)

    # Load JSON data from the file
    messages = read_json_full(message_path)

    # Create list of student names and teacher names which we want filtered.
    # If the xlsx files did not exist, omit from filter.
    if student_path and os.path.exists(student_path):
        student_names = extract_names_from_excel(student_path)
    else:
        student_names = []

    if teacher_path and os.path.exists(teacher_path):
        teacher_names = extract_names_from_excel(teacher_path)
    else:
        teacher_names = []

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
        positive_message = remove_names_from_message(positive_message, names, verbose)
        negative_message = remove_names_from_message(negative_message, names, verbose)
        additional_message = remove_names_from_message(
            additional_message, names, verbose)

        # If entries need to be returned, add the results from the filtering to the entries.
        # Otherwise, add it to the respective lists.
        if return_entries:
            entries_filtered.append({"positive": positive_message, "negative": negative_message,
                                    "additional": additional_message, "sentiment": sentiment})
        else:
            # Append sentiment to its list of sentiments.
            sentiments.append(sentiment)

            # Add the messages to their respective list.
            positive_messages.append(positive_message)
            negative_messages.append(negative_message)
            additional_messages.append(additional_message)

    if return_entries:
        data = {"entries": entries_filtered}
        # Save the output of the filtered entries separate to a file for sentiment analysis.
    else:
        # Save the output of the filtered and sorted outputs to a file for counting.
        data = {
            "positive": positive_messages,
            "negative": negative_messages,
            "additional": additional_messages,
            "sentiment": sentiments
        }
    write_json_full(read_path, data)
    return read_json_full(read_path)


def write_json_full(path, data):
    """ 
    Writing JSON data to a file.
    """

    with open(path, 'w') as output_file:
        json.dump(data, output_file)


def read_json_full(path):
    """ 
    Reading JSON data to a file.
    """

    with open(path, 'r') as json_file:
        data = json.load(json_file)
    return data


def extract_names_from_excel(excel_file_path):
    """
    Function takes names from students and teachers from the excel 
    file that was manually downloaded from Datanose for their course.
    """

    df = pd.read_excel(excel_file_path)

    if 'FirstName' in df.columns and 'LastName' in df.columns:
        combined_names = (df['FirstName'] + ' ' +
                          df['LastName']).str.lower().tolist()
        return combined_names
    else:
        # TODO: Nice exception.
        return []
