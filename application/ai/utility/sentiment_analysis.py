import os
from application.ai.utility.reader import read_json_messages
from application.ai.utility.fd_exceptions import *
from application.ai.utility.common import *
import application.ai.included.models as models_mod
import application.ai.included.tools as tools_mod

from application.backend.common import *
from datetime import datetime
import torch
import os

def get_callable_functions(module):
    """
    Retrieve callable functions defined directly within a module.
    """
    # Retrieve all attributes of the module
    attributes = dir(module)

    # Filter out only the callable functions defined directly in the module
    functions = [
        name for name in attributes 
        if callable(getattr(module, name)) and getattr(module, name).__module__ == module.__name__
    ]

    return functions

def entry_accuracy(student_provided, ai_determined):
    sentiment_mapping = {
        "very positive": {"very positive": 1, "positive": 0.75, "neutral": 0.25, "negative": 0, "very negative" : 0},
        "positive": {"very positive": 0.75, "positive": 1, "neutral": 0.75, "negative": 0.25, "very negative" : 0},
        "neutral": {"very positive": 0.5, "positive": 0.75, "neutral": 1, "negative": 0.75, "very negative" : 0.5},
        "negative": {"very positive": 0, "positive": 0.25, "neutral": 0.75, "negative": 1, "very negative" : 0.75},
        "very negative": {"very positive": 0, "positive": 0, "neutral": 0.25, "negative": 0.75, "very negative" : 1},
    }

    if len(student_provided) != len(ai_determined):
        raise ValueError("Lists must have the same length")
    
    similarity_scores = []
    for i in range(len(student_provided)):
        score_matrix = sentiment_mapping[student_provided[i]]
        similarity_score = score_matrix[ai_determined[i]]
        similarity_scores.append(similarity_score)
    
    return similarity_scores

def comment_accuracy(comment_type, results):
    accuracy = 0
    max_accuracy = len(results) # 49 for positive for PSE dataset.

    sentiment_mapping = {
        "positive": {"very positive": 1, "positive": 1, "neutral": 0.5, "negative": 0, "very negative" : 0},
        "negative": {"very positive": 0, "positive": 0, "neutral": 0.5, "negative": 1, "very negative" : 1},
        "additional": {"very positive": 0.5, "positive": 0.75, "neutral": 1, "negative": 0.75, "very negative" : 0.5},
    }

    for result in results:
        accuracy += sentiment_mapping[comment_type][result]

    if accuracy != 0:
        return accuracy / max_accuracy
    else:
        return 0

def run_application(app_type, comments, none_indices, num_pos, num_neg, device="cuda"):
    results = []
    apps = get_callable_functions(app_type)
    accuracies = {}

    # Check if GPU is available for models supporting it, and fall back to CPU
    # If CUDA unavailable.
    if device == "cuda":
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    for app in apps:
        function = getattr(app_type, app)
        result = function(comments, device)
        
        pos_results = result[:num_pos]
        pos_accuracy = comment_accuracy("positive", pos_results)

        neg_results = result[num_pos:num_pos+num_neg]
        neg_accuracy = comment_accuracy("negative", neg_results)
        
        add_results = result[num_pos+num_neg:]

        # Replace "neutral" result for every 
        # _none_ in the original additional messages list
        for index in none_indices:
            add_results[index] = "neutral"

        add_accuracy = comment_accuracy("additional", add_results)

        results.append(pos_results + neg_results + add_results)

        accuracy = {"pos": pos_accuracy, "neg": neg_accuracy, "add" : add_accuracy}
        accuracies[app] = accuracy

    return accuracies, results

def run_sentiment_analysis(course, read_paths, store_paths, ai=False, verbose=False, overwrite=False):
    if verbose:
        print(f"Arguments parsed: ai={ai} overwrite={overwrite} course={course}")

    # Get the paths for storing and retrieving the files.
    student_path, teacher_path, message_path = read_paths
    student_data_path, ai_data_path, accuracy_path = store_paths

    # If the files to store already exist, and overwrite is false, just return the file contents (POST request).
    # If overwrite is set to true, do not check if files exist and instead just overwrite their contents.
    # If not all files exist, there must be some files missing, so just keep executing and generate the files in the meantime.
    if not overwrite:
        if all(map(check_file_exists, store_paths)):
            modification_date_student = datetime.fromtimestamp(os.path.getmtime(student_data_path))
            modification_date_ai = datetime.fromtimestamp(os.path.getmtime(ai_data_path))

            return read_json(student_data_path), read_json(ai_data_path), read_json(accuracy_path), modification_date_student, modification_date_ai

    # If overwrite was set to true (PUT request), re-filter all input messages for use with sentiment analysis. 
    # If overwrite was set to false (POST request), do not re-filter and just read the files instead.
    messages_read = read_json_messages(course, student_path, teacher_path, message_path, overwrite, return_entries=False)
    student_entry_sentiment_numerical = messages_read['sentiment']

    # Convert numerical values to string values.
    student_entry_sentiment = sentiment_list_convert(student_entry_sentiment_numerical)
    # Count the occurence of each value for comparison to AI, or return after.
    student_entry_sentiment_counter = sentiment_counter(student_entry_sentiment)

    # If ai is true, perform actual sentiment analysis. Otherwise, just store and retrieve new results from students only.
    if ai:
        pos = messages_read["positive"]
        num_pos = len(pos)
        neg = messages_read["negative"]
        num_neg = len(neg)
        add = messages_read["additional"]

        # Adjust for _none_ in additional message:
        # 1) Keep track of indices for _none_ in a list.
        # 2) After parsing messages through model, replace their determined result for this list index with "neutral" sentiment.
        none_indices = [index for index, none in enumerate(add) if none == "_none_"]

        # Combine positive, negative and additional comments together.
        comments = pos + neg + add

        # ai_sentiment_counter = {'very negative': 0, 'negative': 0, 'neutral': 0, 'positive': 0, 'very positive': 0}

        model_accuracies, model_results = run_application(models_mod, comments, none_indices, num_pos, num_neg)
        tool_accuracies, tool_results = run_application(tools_mod, comments, none_indices, num_pos, num_neg)

        # Combine results from all models and tools => nested list of sentiments.
        results = model_results + tool_results

        # Calculate the average results from all models and tools => results in single list of sentiments.
        averaged_result = [sentiment_average(scores) for scores in zip(*results)]
        pos_results = averaged_result[:num_pos]
        neg_results = averaged_result[num_pos:num_pos+num_neg]
        add_results = averaged_result[num_pos+num_neg:]

        # pos results are the results for each model and tool on the positive comment category.
        # We perform element-wise averaging accross rows based on index.
        # This results in a single list of the same length as each individual list.
        # E.g.:
        # Row 1:         [ 1,  2,  3,  4,  5]
        # Row 2:         [ 6,  7,  8,  9, 10]
        # Row 3:         [11, 12, 13, 14, 15]
        # Resulting Row: [ 6,  7,  8,  9, 10]
        average_positive_comment_accuracy = comment_accuracy('positive', pos_results)
        average_negative_comment_accuracy = comment_accuracy('negative', neg_results)
        average_additional_comment_accuracy = comment_accuracy('additional', add_results)

        if verbose:
            print("Per-model accuracy")
            for model, accuracy in model_accuracies.items():
                print(f"{model}: {accuracy}")

            for tool, accuracy in tool_accuracies.items():
                print(f"{tool}: {accuracy}")

            print("Student sentiments provided:")
            print(student_entry_sentiment)

        # Get the sentiment for each entry based on the positive, negative and additional messages combined.
        ai_entry_sentiment = [sentiment_average(scores) for scores in zip(*[pos_results, neg_results, add_results])]
        
        if verbose:
            print("AI determined sentiments:")
            print(f"POS: {pos_results}   | Weighted accuracy: {average_positive_comment_accuracy}")
            print(f"NEG: {neg_results}   | Weighted accuracy: {average_negative_comment_accuracy}")
            print(f"ADD: {add_results}   | Weighted accuracy: {average_additional_comment_accuracy}")
            print(f"AVG: {ai_entry_sentiment}")

        # Adjusted add_results for added "neutral" for each _none_ in the original message (student did not fill in field)
        entry_accuracies = entry_accuracy(student_entry_sentiment, ai_entry_sentiment)
        average_entry_accuracy = np.mean(entry_accuracies)

        # Create sentiment counter for AI determined sentiment.
        ai_entry_sentiment_counter = sentiment_counter(ai_entry_sentiment)

        store_json(ai_data_path, ai_entry_sentiment_counter)
        total_accuracy = {"models": model_accuracies, "tools": tool_accuracies, "pos" : average_positive_comment_accuracy, "neg" : average_negative_comment_accuracy, "add" : average_additional_comment_accuracy, "entry" : average_entry_accuracy}
        store_json(accuracy_path, total_accuracy)

    # Always store student results.
    store_json(student_data_path, student_entry_sentiment_counter)


    # After storing all results, read them from the files and return them.
    modification_date_student = datetime.fromtimestamp(os.path.getmtime(student_data_path))
    modification_date_ai = datetime.fromtimestamp(os.path.getmtime(ai_data_path))
    return read_json(student_data_path), read_json(ai_data_path), read_json(accuracy_path), modification_date_student, modification_date_ai

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Run sentiment analysis script")
    
    parser.add_argument("--course", type=str, default="SSVT", help="Course name")
    parser.add_argument("--ai", action="store_true", default=True, help="Enable AI")
    parser.add_argument("--verbose", action="store_true", default=True, help="Enable verbose mode")
    parser.add_argument("--overwrite", action="store_true", default=True, help="Overwrite existing files")
    
    args = parser.parse_args()
    
    # Get home folder and then append required file structure from there.
    data_path = f"{os.path.expanduser('~')}/feedbackdiary/application/data/{args.course}"
    read_paths = [f"{data_path}/{path}" for path in ["students.xlsx", "teachers.xlsx", "entries.json"]]
    store_paths = [f"{data_path}/{path}" for path in ["sentiment_student.json", "sentiment_ai.json", "accuracy.json"]]
    
    run_sentiment_analysis(args.course, read_paths, store_paths, args.ai, args.verbose, args.overwrite)