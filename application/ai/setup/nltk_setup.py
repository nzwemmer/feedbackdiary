import nltk
from nltk.corpus import stopwords, words

def nltk_download():
    # Download NLTK resources (if not already downloaded)
    nltk.download('punkt')  # Used for tokenization.
    nltk.download('stopwords') # Used to determine stopwords for all languages.
    nltk.download('words')

def nltk_setup():
    # Load NLTK stopwords for English
    stop_words_en = stopwords.words('english')

    # Load NLTK stopwords for Dutch
    stop_words_nl = stopwords.words('dutch')

    # Load NLTK common words for English (used in name removal for example).
    common_words_english = set(words.words())

    return stop_words_en, stop_words_nl, common_words_english