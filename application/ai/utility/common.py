from application.ai.utility.fd_exceptions import *
import os
import numpy as np

from langdetect import detect, LangDetectException


def check_file_exists(file_path):
    return os.path.exists(file_path)

# Function to detect the language of a message
# https://www.nltk.org --> Detect names automatically.


def detect_language(message):
    try:
        if not "_none" in message:
            language = detect(message)
            if language == "en":
                return "english"
            # Found while testing; sometimes Dutch is detected as Afrikaans, especially when a lot of slang is used (like 'ff').
            elif language in ["nl", "af"]:
                return "dutch"
            else:
                raise FDLanguageNotSupported(language, message)
        else:
            raise FDEmptyMessage
    except LangDetectException:
        return "english"  # In case language detection fails, assume English.


def create_filters(stop_words_en, stop_words_nl):
    # Remove custom values that we want to remove. sodm is a custom replacement for student names.
    custom_filter = ["sodm", "<", ">"]

    return set(stop_words_en + custom_filter), set(stop_words_nl + custom_filter)


def sentiment_counter(sentiments):
    sentiments_counter = {'very negative': 0, 'negative': 0,
                          'neutral': 0, 'positive': 0, 'very positive': 0}

    for sentiment in sentiments:
        sentiments_counter[sentiment] += 1

    return sentiments_counter


def sentiment_list_convert(sentiments):
    mapping = {-2: "very negative", -1: "negative", 0: "neutral",
               1: "positive", 2: "very positive", 99: "neutral"}
    sentiment_labels = []

    # 1) Get sentiment label for numerical value.
    # 2) Add it to list of all labels.
    for sentiment in sentiments:
        sentiment_label = mapping.get(sentiment, 'neutral')
        sentiment_labels.append(sentiment_label)

    # Return both counter and labels list
    return sentiment_labels

# Function that maps scores to a certain sentiment.
def calculate_feedbackdiary_score(score):
    if score <= -0.5:
        return "very negative"
    elif score <= -0.05:
        return "negative"
    elif score >= 0.5:
        return "very positive"
    elif score >= 0.05:
        return "positive"
    else:
        return "neutral"


def sentiment_average(scores):
    mapping = {"very positive": 2, "positive": 1,
               "neutral": 0, "negative": -1, "very negative": -2}
    mapping_backwards = {2: "very positive", 1: "positive",
                         0: "neutral", -1: "negative", -2: "very negative"}

    score_values = np.array([mapping[score] for score in scores])
    rounded_average_score = round(np.mean(score_values))

    return mapping_backwards[rounded_average_score]
