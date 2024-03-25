from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from application.ai.utility.common import *

def vader(messages, device=None):
    """ 
    # Input: all messages/comments/submissions from students.
    # Output: all determined sentiments based on messages.

    NOTE: We ignore device here since we can't use it for VADER.
    """
    analyzer = SentimentIntensityAnalyzer()
    scores = []

    for message in messages:
        vs = analyzer.polarity_scores(message)
        compound_score = vs['compound']
        score = calculate_feedbackdiary_score(compound_score)
        scores.append(score)

    return scores