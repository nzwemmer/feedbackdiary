from transformers import pipeline
from application.ai.utility.reader import *
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

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


def calculate_average_sentiment(lists):
    sentiment_mapping = {
        "very positive": 4,
        "positive": 3,
        "neutral": 2,
        "negative": 1,
        "very negative": 0
    }
    
    # Initialize a list to store the average sentiment for each index
    average_sentiments = []
    
    # Iterate through the lists simultaneously
    for sentiments in zip(*lists):
        total_sentiment_score = sum(sentiment_mapping[sentiment] for sentiment in sentiments)
        average_sentiment_score = total_sentiment_score / len(lists)
        
        # Find the corresponding sentiment based on the score
        sentiment = max(sentiment_mapping, key=lambda x: sentiment_mapping[x] <= average_sentiment_score)
        average_sentiments.append(sentiment)
    
    return average_sentiments

# distilbert model #
def distilbert(messages):

    scores = []

    for message in messages:
        model_path = f"/home/feedbackdiary/feedbackdiary/application/ai/models/nlptown/bert-base-multilingual-uncased-sentiment"
        device = "cuda"
        tokenizer = AutoTokenizer.from_pretrained(f"{model_path}/tokenizer")
        model = AutoModelForSequenceClassification.from_pretrained(f"{model_path}/model").to(device)

        # Move inputs to GPU if available
        inputs = tokenizer.encode_plus(message, add_special_tokens=True, return_tensors="pt").to(device)
        outputs = model(**inputs)

        # Move logits to CPU for further processing
        logits = outputs.logits.detach().cpu()
        predicted_class = logits.argmax().item()

        sentiment_classes = ['very negative', 'negative', 'neutral', 'positive', 'very positive']
        predicted_sentiment = sentiment_classes[predicted_class]

        scores.append(predicted_sentiment)

    return scores

def average_sentiment(scores):
    mapping = {"very positive": 2, "positive": 1, "neutral": 0, "negative": -1, "very negative": -2}
    mapping_backwards = {2: "very positive", 1: "positive", 0: "neutral", -1: "negative", -2: "very negative"}

    score_values = np.array([mapping[score] for score in scores])
    rounded_average_score = round(np.mean(score_values))

    return mapping_backwards[rounded_average_score]

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

# LXYUAN MODEL #
def lxyuan(messages):
    distilled_student_sentiment_classifier = pipeline(
        model="lxyuan/distilbert-base-multilingual-cased-sentiments-student", 
        top_k=None,
        device=0
    )

    result = distilled_student_sentiment_classifier(messages)

    scores = []

    for message in result:
        sentiment = message[0]['label']
        score = message[0]['score'] * -1 if sentiment == "negative" else message[0]['score']
        scores.append(calculate_feedbackdiary_score(score))

    return scores

def vader(messages):
    analyzer = SentimentIntensityAnalyzer()
    scores = []

    for message in messages:
        vs = analyzer.polarity_scores(message)
        compound_score = vs['compound']
        score = calculate_feedbackdiary_score(compound_score)
        scores.append(score)

    return scores

def calc_model_accuracy(sentiment, results):
    accuracy = 0
    max_accuracy = len(results) # 50 for positive

    sentiment_mapping = {
        "positive": {"very positive": 1, "positive": 1, "neutral": 0.5, "negative": 0, "very negative" : 0},
        "neutral": {"very positive": 0, "positive": 0.5, "neutral": 1, "negative": 0.5, "very negative" : 0},
        "negative": {"very positive": 0, "positive": 0, "neutral": 0.5, "negative": 1, "very negative" : 1},
    }

    for result in results:
        accuracy += sentiment_mapping[sentiment][result]
    
    if accuracy != 0:
        return accuracy / max_accuracy
    else:
        return 0
    

def similarity_index_wise(list1, list2):
    sentiment_mapping = {
        "very positive": {"very positive": 1, "positive": 0.75, "neutral": 0.25, "negative": 0, "very negative" : 0},
        "positive": {"very positive": 0.75, "positive": 1, "neutral": 0.75, "negative": 0.25, "very negative" : 0},
        "neutral": {"very positive": 0.5, "positive": 0.75, "neutral": 1, "negative": 0.75, "very negative" : 0.5},
        "negative": {"very positive": 0, "positive": 0.25, "neutral": 0.75, "negative": 1, "very negative" : 0.75},
        "very negative": {"very positive": 0, "positive": 0, "neutral": 0.25, "negative": 0.75, "very negative" : 1},
    }

    if len(list1) != len(list2):
        raise ValueError("Lists must have the same length")
    
    similarity_scores = []
    for i in range(len(list1)):
        score_matrix = sentiment_mapping[list1[i]]
        similarity_score = score_matrix[list2[i]]
        similarity_scores.append(similarity_score)
    
    return similarity_scores

if __name__ == "__main__":
    course = "PSE"
    sentiment_type = "AI"
    
    # overwrite=True
    overwrite=False


    data_path = f"../data/{course}"
    read_paths = [f"{data_path}/{path}" for path in ["students.xlsx", "teachers.xlsx", "entries.json"]]
    store_paths = [f"{data_path}/{path}" for path in ["sentiment_student.json", "sentiment_ai.json", "accuracy.json"]]
    student_path, teacher_path, message_path = read_paths
    student_data_path, ai_data_path, accuracy_path = store_paths

    messages = read_json_messages(course, student_path, teacher_path, message_path, overwrite, return_entries=False)

    pos = messages["positive"]
    pos_messages = len(pos)
    
    neg = messages["negative"]
    neg_messages = len(neg)
    
    add = messages["additional"]
    add_messages = len(add)
    
    # Student provided overall sentiment on Likert Scale.
    sentiments = messages["sentiment"]

    all = pos + neg + add

    models = [
        [lxyuan, "LXYUAN"],
        [distilbert, "DISTILBERT"],
        [vader, "VADER"]
    ]

    print("Done reading entries")
    print('\n')

    all_pos_results = []
    all_neg_results = []
    all_add_results = []

    for model, model_name in models:
        result = model(all)
        pos_results = result[:pos_messages]
        neg_results = result[pos_messages:-add_messages]
        add_results = result[pos_messages+neg_messages:]

        add_results += ["neutral" for i in range(pos_messages - add_messages)]
        print(f"LEN: {len(pos_results)}")
        print(f"LEN: {len(neg_results)}")
        print(f"LEN: {len(add_results)}")

        # print(f"POS: {pos_results}, {len(pos_results)}, {pos_messages}")
        # print('\n')
        # print(f"NEG: {neg_results}, {len(neg_results)}, {neg_messages}")
        # print(f"ADD: {add_results}, {len(add_results)}, {add_messages}")
        all_pos_results.append(pos_results)
        all_neg_results.append(neg_results)
        all_add_results.append(add_results)

        # pos_acc = calc_model_accuracy("positive", pos_results)
        # neg_acc = calc_model_accuracy("negative", neg_results)
        # add_acc = calc_model_accuracy("neutral", add_results)
        
        # print(f"POSITIVE ACCURACY: {pos_acc}")
        # print(f"NEGATIVE ACCURACY: {neg_acc}")
        # print(f"ADDITIONAL ACCURACY: {add_acc}")
        print(f"Done with model {model_name}")

    average_sentiments_pos = calculate_average_sentiment(all_pos_results)
    average_sentiments_neg = calculate_average_sentiment(all_neg_results)
    average_sentiments_add = calculate_average_sentiment(all_add_results)    

    print("Average positive results:", average_sentiments_pos)
    print("Average negative results:", average_sentiments_neg)
    print("Average additional results:", average_sentiments_add)

    pos_acc = calc_model_accuracy("positive", average_sentiments_pos)
    neg_acc = calc_model_accuracy("negative", average_sentiments_neg)
    add_acc = calc_model_accuracy("neutral", average_sentiments_add)
        
    all_averages = [average_sentiments_pos, average_sentiments_neg, average_sentiments_add]

    print(f"POSITIVE ACCURACY: {pos_acc}")
    print(f"NEGATIVE ACCURACY: {neg_acc}")
    print(f"ADDITIONAL ACCURACY: {add_acc}")

    average_entry_sentiment = calculate_average_sentiment(all_averages)
    print(f"Entry sentiment from SA: \n{average_entry_sentiment}")

    new_sentiments = [sentiment_convert(sentiment) for sentiment in sentiments]
    print(f"{new_sentiments}\n ^ Entry sentiment from student")

    similarity_entry_sentiment = similarity_index_wise(average_entry_sentiment, new_sentiments)
    print(f'Entry sentiment weighted accuracy: \n {similarity_entry_sentiment}')
    print(f'Average entry sentiment weighted accuracy: {np.average(similarity_entry_sentiment)}')




    
