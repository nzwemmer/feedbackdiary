from transformers import pipeline
from application.ai.utility.common import *

def lxyuan(messages, device="cpu"):
    """
    LXYUAN model for sentiment analysis.

    Input: 
        messages :: list of messages; positive, negative, additional
        device :: "cuda" or "cpu". Defaults to "cpu" if cuda unavailable.
    Output:
        FD scores on Likert scale for each message: 

        ["very negative" ... "very positive"]
    """

    distilled_student_sentiment_classifier = pipeline(
        model="lxyuan/distilbert-base-multilingual-cased-sentiments-student", 
        top_k=None,
        device=device
    )

    result = distilled_student_sentiment_classifier(messages)

    scores = []

    for message in result:
        sentiment = message[0]['label']
        score = message[0]['score'] * -1 if sentiment == "negative" else message[0]['score']
        scores.append(calculate_feedbackdiary_score(score))

    return scores

def nlptown(messages, device="cpu"):
    """
    NLPTOWN models for sentiment analysis

    Input: 
        messages :: list of messages; positive, negative, additional
        device :: "cuda" or "cpu". Defaults to "cpu" if cuda unavailable.
    Output:
        FD scores on Likert scale for each message: 

        ["very negative" ... "very positive"]
    """

    mapping = {"1 star" : "very negative",
            "2 stars" : "negative",
            "3 stars" : "neutral",
            "4 stars" : "positive",
            "5 stars" : "very positive"}

    model_path = f"nlptown/bert-base-multilingual-uncased-sentiment"

    sentiment_task = pipeline("sentiment-analysis", model=model_path, tokenizer=model_path, device=device)
    results = sentiment_task(messages)

    return [mapping[result['label']] for result in results]

if __name__ == "__main__":
    print(lxyuan(["_none_"]))
    print(nlptown(["_none_"]))
