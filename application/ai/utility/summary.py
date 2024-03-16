from transformers import pipeline
import os
from datetime import datetime
from application.ai.utility.reader import read_json_full
from application.backend.common import *
import torch
import argparse

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

def summarize(text, device=None, truncate=False):
    if not device:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    summarizer = pipeline("summarization", model="knkarthick/MEETING_SUMMARY", truncation=truncate, device=device)
    summary = summarizer(text)[0]['summary_text']
    del summarizer  # Deleting the summarizer object to release GPU memory
    torch.cuda.empty_cache() # Also emptying cache to further clear GPU memory
    return summary

def run_truncated(message_path, store_path=None, device=None, overwrite=False):
    
    if store_path:
        if os.path.exists(store_path) and not overwrite:
            summaries = read_json(store_path)
            modify_date = datetime.fromtimestamp(os.path.getmtime(store_path))
            return summaries, modify_date

    messages = read_json_full(message_path)["entries"]
    positive, negative, additional = zip(*[(message["positive"], message["negative"], message["additional"]) for message in messages])

    positive_string = "".join(positive)
    negative_string = "".join(negative)
    additional_string = "".join(additional)

    summaries = {
        "positive_summary" : summarize(positive_string, device, truncate=True).replace("sodm", "REDACTED"),
        "negative_summary" : summarize(negative_string, device, truncate=True).replace("sodm", "REDACTED"),
        "additional_summary" : summarize(additional_string, device, truncate=True).replace("sodm", "REDACTED")
    }

    if store_path:
        store_json(store_path, summaries)
        modify_date = datetime.fromtimestamp(os.path.getmtime(store_path))

        return summaries, modify_date
    else:
        return summaries

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


if __name__ == "__main__":
    message_path = "../../data/PSE/messages_filtered.json"

    parser = argparse.ArgumentParser(description="Run truncated function with specified arguments.")
    parser.add_argument("--device", default="cpu", choices=["cpu", "cuda"], help="Specify the device (cpu/cuda)")

    args = parser.parse_args()

    message_path = "../../data/PSE/messages_filtered.json"
    run_truncated(message_path, None, device=args.device)

    # Useful if truncated messages somehow do not create accurate enough results. Much slower however. Omitted for POC version.
    # run_combined_messages(message_path) 
