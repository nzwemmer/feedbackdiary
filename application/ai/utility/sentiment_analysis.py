from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import os
from application.ai.utility.reader import read_json_messages
from application.ai.utility.fd_exceptions import *
from application.ai.utility.common import *
from application.backend.common import *
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from datetime import datetime

from transformers import pipeline
import numpy as np
import os

def check_file_exists(file_path):
    return os.path.exists(file_path)

def sentiment_convert(sentiment):
    mapping = {'very negative': -2, 'negative': -1, 'neutral': 0, 'positive': 1, 'very positive': 2}
    mapping_backwards = {-2: "very negative", -1: "negative", 0: "neutral", 1: "positive", 2: "very positive", 99: "neutral"}

    # Check if the input is an integer
    if isinstance(sentiment, int):
        return mapping_backwards.get(sentiment, None)
    # Check if the input is a string
    elif isinstance(sentiment, str):
        return mapping.get(sentiment, None)
    else:
        return None

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

def calculate_feedbackdiary_accuracy_per_message(message_type, determined):
    # Positive/negative message field filled in by student => Expected Positive/Negative.
    # Read as "if negative in negative / very negative => return 100% accurate."
    if message_type in determined:
        return 1
    # Additional message field filled in by student => probably Neutral, but could be any.
    # Just less likely to be other than neutral, so score higher for neutral and lower for any other.
    elif message_type == "additional":
        if "neutral" in determined:
            return 1
        else:
            return 0.5
    # Example: positive message field by student, sentiment detected was negative or neutral.
    else:
        return False

def calculate_feedbackdiary_accuracy(average, overall_sentiment):

    sentiment_mapping = {
        "very positive": {"very positive": 1, "positive": 0.75, "neutral": 0.25, "negative": 0, "very negative" : 0},
        "positive": {"very positive": 0.75, "positive": 1, "neutral": 0.75, "negative": 0.25, "very negative" : 0},
        "neutral": {"very positive": 0.5, "positive": 0.75, "neutral": 1, "negative": 0.75, "very negative" : 0.5},
        "negative": {"very positive": 0, "positive": 0.25, "neutral": 0.75, "negative": 1, "very negative" : 0.75},
        "very negative": {"very positive": 0, "positive": 0, "neutral": 0.25, "negative": 0.75, "very negative" : 1},
    }

    return sentiment_mapping[average][overall_sentiment]

def average_sentiment(scores):
    mapping = {"very positive": 2, "positive": 1, "neutral": 0, "negative": -1, "very negative": -2}
    mapping_backwards = {2: "very positive", 1: "positive", 0: "neutral", -1: "negative", -2: "very negative"}

    score_values = np.array([mapping[score] for score in scores])
    rounded_average_score = round(np.mean(score_values))

    return mapping_backwards[rounded_average_score]

######################################################################### MODELS #########################################################################
############## DistilBERT mulitlingual uncased Sentiment Analysis
def distilbert_fd(message):

    model_path = f"/home/feedbackdiary/feedbackdiary/application/ai/models/nlptown/bert-base-multilingual-uncased-sentiment"
    if check_file_exists(model_path):
        # Load the tokenizer and model.
        tokenizer = AutoTokenizer.from_pretrained(f"{model_path}/tokenizer")
        model = AutoModelForSequenceClassification.from_pretrained(f"{model_path}/model")
    else:
        print("ERROR IN DISTILBERT MULTIL UNCASED SENTIMENT: MODEL DOES NOT EXIST!")

    inputs = tokenizer.encode_plus(message, add_special_tokens=True, return_tensors="pt")
    outputs = model(**inputs)
    predicted_class = outputs.logits.argmax().item()
    sentiment_classes = ['very negative', 'negative', 'neutral', 'positive', 'very positive']
    predicted_sentiment = sentiment_classes[predicted_class]
    return predicted_sentiment
############## DistilBERT mulitling Sentiment Analysis
############## lxyuan/distilbert-base-multilingual-cased-sentiments-student ################
def lxyuan_fd(message):
    distilled_student_sentiment_classifier = pipeline(
        model="lxyuan/distilbert-base-multilingual-cased-sentiments-student", 
        top_k=None,
        device=0
    )

    result = distilled_student_sentiment_classifier(message)[0][0]

    if result['label'] == 'negative':
        result['score'] *= -1

    result['fd_score'] = calculate_feedbackdiary_score(result['score'])

    return result
############## lxyuan/distilbert-base-multilingual-cased-sentiments-student ################
############## VADER ##############
def vader_fd(message):
    analyzer = SentimentIntensityAnalyzer()

    vs = analyzer.polarity_scores(message)
    compound_score = vs['compound']
    return {'score' : vs['compound'], "fd_score" : calculate_feedbackdiary_score(compound_score)}
############## VADER ##############

def run_sentiment_analysis(course, read_paths, store_paths, ai=False, verbose=False, overwrite=False):
    student_path, teacher_path, message_path = read_paths
    student_data_path, ai_data_path, accuracy_path = store_paths

    # If overwrite was set to true (PUT request), re-filter all input messages for use with sentiment analysis. 
    # If overwrite was set to false (POST request), do not re-filter and just read the files instead.
    all_messages = read_json_messages(course, student_path, teacher_path, message_path, overwrite, sentiment_analysis=True)

    # Used for storing the sentiments parsed by students and the AI.
    student_sentiments = {'very negative': 0, 'negative': 0, 'neutral': 0, 'positive': 0, 'very positive': 0}
    ai_sentiments = {'very negative': 0, 'negative': 0, 'neutral': 0, 'positive': 0, 'very positive': 0}

    # List to keep all accuracies for each of the entries. Used for calculating the ultimate accuracy of the AI.
    pos_accuracies = []
    neg_accuracies = []
    add_accuracies = []
    entry_accuracies = []

    # If the files to store already exist, and overwrite is false, just return the file contents (POST request).
    # If overwrite is set to true, do not check if files exist and instead just overwrite their contents.
    # If not all files exist, there must be some files missing, so just keep executing and generate the files in the meantime.
    if not overwrite:
        if all(map(check_file_exists, store_paths)):
            modification_date_student = datetime.fromtimestamp(os.path.getmtime(student_data_path))
            modification_date_ai = datetime.fromtimestamp(os.path.getmtime(ai_data_path))

            return read_json(student_data_path), read_json(ai_data_path), read_json(accuracy_path), modification_date_student, modification_date_ai

    # Otherwise perform filtering of data using read_json_messages
    if verbose:
        print(f"Arguments parsed: ai={ai} overwrite={overwrite}")

    for entry in all_messages['entries']:
        # Student provided sentiment for compare. Store for later comparison and accuracy calculation.
        student_overall_sentiment_int = entry["sentiment"]
        student_overall_sentiment_str = sentiment_convert(student_overall_sentiment_int)
        student_sentiments[student_overall_sentiment_str] += 1

        if ai:
            pos = entry["positive"]
            neg = entry["negative"]
            add = entry['additional']

            # Perform sentiment analysis on each of the messages within an entry.
            # The placeholder message can be omitted, saving on some computation time.
            # I consider this message neutral. Add it to each model results for normal computation afterwards.
            if "_none_" in add:
                print("Empty additional detected, skipping.")
                lxyuan = [lxyuan_fd(pos)['fd_score'], lxyuan_fd(neg)['fd_score']]
                distilbert = [distilbert_fd(pos), distilbert_fd(neg)]
                vader = [vader_fd(pos)['fd_score'], vader_fd(neg)['fd_score']]
                
                # Add neutral as this influences the results in the least significant way.
                # Also, we expect that students leaving the field empty means they feel indifferent to this particular submission.
                lxyuan.append("neutral")
                distilbert.append("neutral")
                vader.append("neutral")
            else:
                lxyuan = [lxyuan_fd(pos)['fd_score'], lxyuan_fd(neg)['fd_score'], lxyuan_fd(add)['fd_score']]
                distilbert = [distilbert_fd(pos), distilbert_fd(neg), distilbert_fd(add)]
                vader = [vader_fd(pos)['fd_score'], vader_fd(neg)['fd_score'], vader_fd(add)['fd_score']]

            # First calculate all averages for each type (positive, negative, additional) for all model results.
            pos_average = average_sentiment([lxyuan[0], distilbert[0], vader[0]])
            neg_average = average_sentiment([lxyuan[1], distilbert[1], vader[1]])
            add_average = average_sentiment([lxyuan[2], distilbert[2], vader[2]])

            # Secondly calculate accuracy of positive/negative/additional message detection based on the models parsed.
            # NOTE: Students can misuse this by sending a negative message in the positive field or vice versa.
            # Regardless, some considerations had to be made.
            pos_accuracy = calculate_feedbackdiary_accuracy_per_message("positive", pos_average)
            neg_accuracy = calculate_feedbackdiary_accuracy_per_message("negative", neg_average)
            add_accuracy = calculate_feedbackdiary_accuracy_per_message("additional", add_average)

            # Thirdly calculate the overall average of the previous types combined (so over the entire entry).
            entry_average = average_sentiment([pos_average, neg_average, add_average])

            ## Add to ai_sentiments result dict.
            ai_sentiments[entry_average] += 1

            # Fourthly calculate accuracy based on total average combined and the provided sentiment by the student themselves.
            entry_accuracy = calculate_feedbackdiary_accuracy(entry_average, student_overall_sentiment_str)

            pos_accuracies.append(pos_accuracy)
            neg_accuracies.append(neg_accuracy)
            add_accuracies.append(add_accuracy)
            entry_accuracies.append(entry_accuracy)

            # Legacy average calculation. Omit once ready.
            # total_accuracy = ((pos_accuracy + neg_accuracy + add_accuracy) / 3) * 0.25 + entry_accuracy * 0.75

            if verbose:
                print("============================================================================================================")
                print(f"Pos message: {pos[:4]} | AI: [{lxyuan[0]}], [{distilbert[0]}], [{vader[0]}] | Avg. Pos.: {pos_average} | ")
                print(f"Neg message: {neg[:4]} | AI: [{lxyuan[1]}], [{distilbert[1]}], [{vader[1]}] | Avg. Neg.: {neg_average} | ")
                print(f"Add message: {add[:4]} | AI: [{lxyuan[2]}], [{distilbert[2]}], [{vader[2]}] | Avg. Add.: {add_average} | ")
                print("============================================================================================================")
                print(f"Avg. Entry: {entry_average} | Student: {student_overall_sentiment_str} | Accuracy: {entry_accuracy} | ")

    if ai:
        average_pos_accuracy = sum(pos_accuracies) / len(pos_accuracies)
        average_neg_accuracy = sum(neg_accuracies) / len(neg_accuracies)
        average_add_accuracy = sum(add_accuracies) / len(add_accuracies)
        average_entry_accuracy = sum(entry_accuracies) / len(entry_accuracies)

    # If verbose was true and new files were generated, print the results to the terminal as well.
    # Primarily used for debugging purposes.
    if verbose:
        print("ALL STUDENT SENTIMENTS: ")
        for sentiment, score in student_sentiments.items():
            print(f"Sentiment: {sentiment}; score: {score}")

        if ai:
            print("ALL AI SENTIMENTS: ")
            for sentiment, score in ai_sentiments.items():
                print(f"Sentiment: {sentiment}; score: {score}")

            print(f"Pos accuracy: {average_pos_accuracy}")
            print(f"Neg accuracy: {average_neg_accuracy}")
            print(f"Add accuracy: {average_add_accuracy}")
            print(f"Entry accuracy: {average_entry_accuracy}")

    # Always store student results.
    store_json(student_data_path, student_sentiments)

    # Store AI results if ai argument was parsed. Alternatively, only student results should be stored.
    if ai:
        store_json(ai_data_path, ai_sentiments)

        total_accuracy = {"pos" : average_pos_accuracy, "neg" : average_neg_accuracy, "add" : average_add_accuracy, "entry" : average_entry_accuracy}
        store_json(accuracy_path, total_accuracy)

    # After storing all results, read them from the files and return them.
    modification_date_student = datetime.fromtimestamp(os.path.getmtime(student_data_path))
    modification_date_ai = datetime.fromtimestamp(os.path.getmtime(ai_data_path))
    return read_json(student_data_path), read_json(ai_data_path), read_json(accuracy_path), modification_date_student, modification_date_ai