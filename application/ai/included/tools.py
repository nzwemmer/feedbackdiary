from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from application.ai.utility.common import *


def vader(messages, device=None):
    """ 
    Analyzes sentiment using VADER (Valence Aware Dictionary and sEntiment Reasoner).

    Args:
        messages (list of str): All messages/comments/submissions from students.
        device (optional): Ignored parameter since VADER does not require it.

    Returns:
        list: Sentiment scores determined based on the input messages.
    """
    # Initialize the SentimentIntensityAnalyzer
    analyzer = SentimentIntensityAnalyzer()
    scores = []

    # Iterate over each message to analyze sentiment
    for message in messages:
        # Get sentiment scores using VADER
        vs = analyzer.polarity_scores(message)
        # Extract the compound score which represents overall sentiment
        compound_score = vs['compound']
        # Calculate feedback diary score based on compound score
        score = calculate_feedbackdiary_score(compound_score)
        # Append the score to the list of scores
        scores.append(score)

    return scores
