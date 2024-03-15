import os
from transformers import pipeline
from models.models import model_list
from utility.download import download_models
from utility.reader import read_text
import torch.nn.functional as F
# from transformers import BertTokenizer, BertForSequenceClassification, AutoTokenizer, AutoModelForSequenceClassification, DistilBertTokenizer, DistilBertForSequenceClassification, pipeline

# https://huggingface.co/spaces/CK42/sentiment-model-comparison

def run_sentiment_analysis(text, verbose=True, model_list=model_list):
    result = []

    for model_name, [tokenizer, classification] in model_list.items():
        model_path = f"models/{model_name}"
        if os.path.exists(model_path):
            # print(f"\n|| RUNNING || {model_path}\n")
            # Load the tokenizer and model.
            tokenizer = tokenizer.from_pretrained(f"{model_path}/tokenizer")
            model = classification.from_pretrained(f"{model_path}/model")

            # Tokenize the text
            inputs = tokenizer.encode_plus(
                text,
                add_special_tokens=True,
                max_length=1024,
                truncation=True,
                padding="longest",
                return_tensors="pt"
            )

            # Perform sentiment analysis
            outputs = model(**inputs)
            # print(outputs.logits[0].tolist())
            percentages, probabilities = calc_prob(outputs.logits)
            # print(probabilities)
            # print(percentages)
            # predicted_class = outputs.logits.argmax().item()
            # print(predicted_class)
            # sentiment = ["very negative", "negative", "neutral", "positive", "very positive"][predicted_class]
            # print(sentiment)
            result.append(percentages)
        else:
            # print(f"\n|| ERROR || Model {model_path} not found! Trying to redownload it... \n")
            download_models()
    
    return result

def extract_recurring_words():
    pass

def run_zero_shot(text):
    # Zero-Shot essentially allows re-training of the model, where you setup labels to check against.
    # This explanation is highly simplified, but it gets the job done.
    # https://huggingface.co/sileod/deberta-v3-base-tasksource-nli

    tokenizer = "models/sileod/deberta-v3-base-tasksource-nli/tokenizer"
    model = "models/sileod/deberta-v3-base-tasksource-nli/model"
    classifier = pipeline("zero-shot-classification", tokenizer=tokenizer, model=model)

    # The general base case: see if can be determined what this message is about.
    base_case_labels = ['teachers', 'course', 'assignment', 'workload', 'urgent']
    result_classifier = classifier(text, base_case_labels)
    # print(f"\n|| Result from base test ZS: {result_classifier} \n")

    candidate_labels_list = []

    for label, score in zip(result_classifier['labels'], result_classifier['scores']):
        # If the score is lower than its equal share of 100%, do not include it.
        if score > 1 / len(base_case_labels):
            if label == "urgent":
                candidate_labels_list.append([f"{label}", f"not {label}"])
            candidate_labels_list.append([f"good {label}", f"bad {label}"])

    # print(candidate_labels_list)

    # for candidate_labels in candidate_labels_list:
        # print(classifier(text, candidate_labels))

def calc_prob(tensor_result):
    probabilities = F.softmax(tensor_result, dim=1)
    # Print the probabilities
    probabilities = probabilities[0].tolist()
    return [100 * x for x in probabilities], probabilities

download_models()

text = read_text()
for line in text:
    # print(f"\n|| INPUT || {line}\n")

    # print("\n|| SENTIMENT ANALYSIS ||\n")
    # run_sentiment_analysis(line)

    # Added August 8, include ZS classifcation to introduce classes which are deemed logical.
    # print("\n|| ZERO-SHOT ||\n")
    run_zero_shot(line)