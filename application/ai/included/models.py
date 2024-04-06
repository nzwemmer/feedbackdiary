from transformers import pipeline
from application.ai.utility.common import calculate_feedbackdiary_score

def lxyuan(entries, device="cpu"):
    """
    Perform sentiment analysis using the LXYUAN model.

    Args:
        entries (list): The full list of entries for a course.
        device (str): Device to run the model on, "cuda" or "cpu". Defaults to "cpu" if cuda is unavailable.

    Returns:
        list: A list of FeedbackDiary (FD) scores on a Likert scale for each entry.
              Possible values are ["very negative", ..., "very positive"].
    """
    # Path to the LXYUAN model for sentiment analysis
    model_path = "lxyuan/distilbert-base-multilingual-cased-sentiments-student"

    # Load the LXYUAN model for sentiment analysis
    distilled_student_sentiment_classifier = pipeline(
        model=model_path,
        device=device
    )

    # Perform sentiment analysis on the input entries
    result = distilled_student_sentiment_classifier(entries)

    # Process the sentiment analysis results and calculate FD scores
    scores = []
    for entry in result:
        sentiment = entry['label']
        score = entry['score'] * -1 if sentiment == "negative" else entry['score']
        scores.append(calculate_feedbackdiary_score(score))

    return scores


def nlptown(entries, device="cpu"):
    """
    Perform sentiment analysis using the NLPTOWN models.

    Args:
        entries (list): The full list of entries for a course.
        device (str): Device to run the model on, "cuda" or "cpu". Defaults to "cpu" if cuda is unavailable.

    Returns:
        list: A list of FeedbackDiary (FD) scores on a Likert scale for each entry.
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

    # Perform sentiment analysis on the input entries
    results = sentiment_task(entries)

    # Map sentiment labels to FD scale and return scores
    return [mapping[result['label']] for result in results]

if __name__ == "__main__":
    inputs = ["I am very happy", "I am very sad"]
    print(lxyuan(inputs))
    print(nlptown(inputs))
