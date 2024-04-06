from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from application.ai.utility.common import *


def vader(entries, device=None):
    """ 
    Analyzes sentiment using VADER (Valence Aware Dictionary and sEntiment Reasoner).

  Args:
        entries (list): The full list of entries for a course.
        device (optional): Ignored parameter since VADER does not require it.

    Returns:
        list: Sentiment scores determined based on the input entries.
    """
    # Initialize the SentimentIntensityAnalyzer
    analyzer = SentimentIntensityAnalyzer()
    scores = []

    # Iterate over each entry to analyze sentiment
    for entry in entries:
        # Get sentiment scores using VADER
        vs = analyzer.polarity_scores(entry)
        # Extract the compound score which represents overall sentiment
        compound_score = vs['compound']
        # Calculate feedback diary score based on compound score
        score = calculate_feedbackdiary_score(compound_score)
        # Append the score to the list of scores
        scores.append(score)

    return scores

if __name__ == "__main__":
    print(vader(["I am very happy", "I am very sad"]))
    # print(nlptown(["_none_"]))
