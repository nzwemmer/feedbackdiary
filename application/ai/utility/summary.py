from transformers import pipeline
import os
from datetime import datetime
from application.ai.utility.reader import read_json_full, read_json_messages
from application.backend.common import *
import torch

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
    # If no device or GPU was parsed, choose the best available option.
    # If GPU is unavailable, instead of crashing, it will resort to CPU.
    if not device or device == "cuda":
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    summarizer = pipeline("text2text-generation",
                          model="lxyuan/distilbart-finetuned-summarization", truncation=truncate, device=device)
    summary = summarizer(text)[0]['generated_text']

    return summary


def run_truncated(course, message_path, student_path=None, teacher_path=None, store_path=None, device=None, overwrite=False):
    if store_path:
        if os.path.exists(store_path) and not overwrite:
            summaries = read_json(store_path)
            modify_date = datetime.fromtimestamp(os.path.getmtime(store_path))
            return summaries, modify_date

    messages = read_json_messages(course, student_path, teacher_path, message_path, overwrite=overwrite, return_entries=False, verbose=True)
    positive = messages["positive"]
    negative = messages["negative"]
    additional = messages["additional"]

    positive_string = " ".join(positive)
    negative_string = " ".join(negative)
    additional_string = " ".join(additional)

    summaries = {
        "positive_summary": summarize(positive_string, device, truncate=True),
        "negative_summary": summarize(negative_string, device, truncate=True),
        "additional_summary": summarize(additional_string, device, truncate=True)
    }

    if store_path:
        store_json(store_path, summaries)
        modify_date = datetime.fromtimestamp(os.path.getmtime(store_path))

        return summaries, modify_date
    else:
        return summaries


def run_combined_messages(message_path):
    messages = read_json_full(message_path)["entries"]

    positive, negative, additional = zip(
        *[(message["positive"], message["negative"], message["additional"]) for message in messages])

    print("Processed file. Running summarizer")
    print("Positive")
    print(combine_category(positive))
    print("Negative")
    print(combine_category(negative))
    print("Additional")
    print(combine_category(additional))


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Run summary with specified arguments.")

    parser.add_argument("--course", type=str,
                        default="PSE", help="Course name")
    parser.add_argument("--overwrite", action="store_true",
                    default=True, help="Overwrite existing files")
    parser.add_argument("--cpu", action="store_true",
                    default=False, help="Use CPU instead of CUDA")
    
    args = parser.parse_args()

    device = "cpu" if args.cpu else "cuda"
    
    message_path = f"../../data/{args.course}/entries.json"
    store_path = "TEST.JSON"
    run_truncated(args.course, message_path, store_path=store_path, device=device, overwrite=args.overwrite)

    # Useful if truncated messages somehow do not create accurate enough results. Much slower however. Omitted for POC version.
    # run_combined_messages(message_path)
