from application.ai.setup.nltk_setup import nltk_setup
from application.ai.utility.reader import read_json_messages
from application.ai.utility.fd_exceptions import *

from langdetect import detect, LangDetectException

# Function to detect the language of a message
# https://www.nltk.org --> Detect names automatically.
def detect_language(message):
    try:
        if not "_none" in message:
            language = detect(message)
            if language == "en":
                return "english"
            # Found while testing; sometimes Dutch is detected as Afrikaans, especially when a lot of slang is used (like 'ff').
            elif language in ["nl", "af"]:
                return "dutch"
            else:
                raise FDLanguageNotSupported(language, message)
        else:
            raise FDEmptyMessage
    except LangDetectException:
        return "english"  # In case language detection fails, assume English.

def create_filters(stop_words_en, stop_words_nl):
    # Remove custom values that we want to remove. sodm is a custom replacement for student names.
    custom_filter = ["sodm", "<", ">"]

    return set(stop_words_en + custom_filter), set(stop_words_nl + custom_filter)
