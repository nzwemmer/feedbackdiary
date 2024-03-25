from transformers import pipeline
from application.ai.utility.common import calculate_feedbackdiary_score


def lxyuan(messages, device="cpu"):
    """
    Perform sentiment analysis using the LXYUAN model.

    Args:
        messages (list): A list of messages categorized as positive, negative, or additional.
        device (str): Device to run the model on, "cuda" or "cpu". Defaults to "cpu" if cuda is unavailable.

    Returns:
        list: A list of FeedbackDiary (FD) scores on a Likert scale for each message.
              Possible values are ["very negative", ..., "very positive"].
    """
    # Path to the LXYUAN model for sentiment analysis
    model_path = "lxyuan/distilbert-base-multilingual-cased-sentiments-student"

    # Load the LXYUAN model for sentiment analysis
    distilled_student_sentiment_classifier = pipeline(
        model=model_path,
        top_k=None,
        device=device
    )

    # Perform sentiment analysis on the input messages
    result = distilled_student_sentiment_classifier(messages)

    # Process the sentiment analysis results and calculate FD scores
    scores = []
    for message in result:
        sentiment = message[0]['label']
        score = message[0]['score'] * - \
            1 if sentiment == "negative" else message[0]['score']
        scores.append(calculate_feedbackdiary_score(score))

    return scores


def nlptown(messages, device="cpu"):
    """
    Perform sentiment analysis using the NLPTOWN models.

    Args:
        messages (list): A list of messages categorized as positive, negative, or additional.
        device (str): Device to run the model on, "cuda" or "cpu". Defaults to "cpu" if cuda is unavailable.

    Returns:
        list: A list of FeedbackDiary (FD) scores on a Likert scale for each message.
              Possible values are ["very negative", ..., "very positive"].
    """
    # Mapping of sentiment labels returned by NLPTOWN model to FD scale
    mapping = {
        "1 star": "very negative",
        "2 stars": "negative",
        "3 stars": "neutral",
        "4 stars": "positive",
        "5 stars": "very positive"
    }

    # Path to the NLPTOWN model for sentiment analysis
    model_path = "nlptown/bert-base-multilingual-uncased-sentiment"

    # Load the NLPTOWN model for sentiment analysis
    sentiment_task = pipeline(
        "sentiment-analysis", model=model_path, tokenizer=model_path, device=device)

    # Perform sentiment analysis on the input messages
    results = sentiment_task(messages)

    # Map sentiment labels to FD scale and return scores
    return [mapping[result['label']] for result in results]


if __name__ == "__main__":
    # Test the lxyuan and nlptown functions with a placeholder message
    print(lxyuan(["_none_"]))
    print(nlptown(["_none_"]))
