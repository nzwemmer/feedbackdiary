from transformers import pipeline
import os
from datetime import datetime
from application.ai.utility.reader import read_json_full
from application.backend.common import *


def combine_category(messages):
    max_length = 1024
    summary_list = []

    while messages:
        current_summary = ""
        remaining_messages = []

        for msg in messages:
            if len(current_summary) + len(msg) <= max_length:
                current_summary += msg
            else:
                remaining_messages.append(msg)

        summary_list.append(summarize(current_summary))
        messages = remaining_messages

    while len(summary_list) > 1:
        current_summary = ""
        remaining_summaries = []

        for summary in summary_list:
            if len(current_summary) + len(summary) <= max_length:
                current_summary += summary
            else:
                remaining_summaries.append(summary)

        summary_list = remaining_summaries
        if current_summary:
            summary_list.append(summarize(current_summary))

    return summary_list[0]

def summarize(text, truncate=False):
    summarizer = pipeline("summarization", model="knkarthick/MEETING_SUMMARY", truncation=truncate, device=0)
    return summarizer(text)[0]['summary_text']

def run_combined_messages(message_path):
    messages = read_json_full(message_path)["entries"]

    positive, negative, additional = zip(*[(message["positive"], message["negative"], message["additional"]) for message in messages])

    print("Processed file. Running summarizer")
    print("Positive")
    print(combine_category(positive))
    print("Negative")
    print(combine_category(negative))
    print("Additional")
    print(combine_category(additional))

def run_truncated(message_path, store_path, overwrite=False):
    if os.path.exists(store_path) and not overwrite:
        summaries = read_json(store_path)
        modify_date = datetime.fromtimestamp(os.path.getmtime(store_path))
        return summaries, modify_date

    messages = read_json_full(message_path)["entries"]
    positive, negative, additional = zip(*[(message["positive"], message["negative"], message["additional"]) for message in messages])

    positive_string = "".join(positive)
    negative_string = "".join(negative)
    additional_string = "".join(additional)

    positive_summary_result = summarize(positive_string, truncate=True).replace("sodm", "REDACTED")
    negative_summary_result = summarize(negative_string, truncate=True).replace("sodm", "REDACTED")
    additional_summary_result = summarize(additional_string, truncate=True).replace("sodm", "REDACTED")

    summaries = {
        "positive_summary" : positive_summary_result,
        "negative_summary" : negative_summary_result,
        "additional_summary" : additional_summary_result
    }

    store_json(store_path, summaries)
    modify_date = datetime.fromtimestamp(os.path.getmtime(store_path))

    return summaries, modify_date

if __name__ == "__main__":
    # run_combined_messages(message_path)  Useful if truncated messages somehow do not create accurate enough results. Much slower however. Omitted for POC version.
    message_path = "../../data/KNP/messages_filtered.json"

    run_truncated(message_path)

    student_sentiment, ai_sentiment, accuracy, modify_date_student, modify_date_ai = sentiment_analysis.run_sentiment_analysis(course, read_paths, store_paths, ai, verbose, overwrite)
