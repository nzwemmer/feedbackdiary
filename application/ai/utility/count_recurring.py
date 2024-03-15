import nltk
from application.ai.utility import common
from application.ai.setup.nltk_setup import nltk_setup
from application.ai.utility.reader import read_json_messages
from application.ai.utility.fd_exceptions import *

from collections import Counter
# from detection.detect_names import detect_names_nltk, detect_names_spacy ---> Using hardcoded names for now. Better success.

def count_recurring(course, student_path, teacher_path, messages_path, verbose=False, overwrite=False):
    all_messages = read_json_messages(course, student_path, teacher_path, messages_path, overwrite=overwrite)
    stop_words_en, stop_words_nl, _ = nltk_setup()

    # Initialize separate counters for each message type and language
    counters = {
        "english": {
            "positive": Counter(),
            "negative": Counter(),
            "additional": Counter(),
            "combined": Counter()
        },
        "dutch": {
            "positive": Counter(),
            "negative": Counter(),
            "additional": Counter(),
            "combined": Counter()
        }
    }

    # Create the filters for words (English and Dutch).
    filters = {
        "english": common.create_filters(stop_words_en, stop_words_nl)[0],
        "dutch": common.create_filters(stop_words_en, stop_words_nl)[1]
    }

    for message_type, messages in all_messages.items():  # Positive, negative, additional

        if message_type == "sentiment":
            continue

        for message in messages:
            try:
                language = common.detect_language(message)
                # Select filter and counters based on language and message type.
                filter_current = filters[language]
                counter_current = counters[language][message_type]

                if language == "dutch":
                    # Tokenize the message based on language.
                    tokens = nltk.word_tokenize(message, language=language)

                    # Determine which words are to be counted based on filter.
                    words = [word.lower() for word in tokens if word.isalnum() and word.lower() not in filter_current and len(word) > 3]

                    counter_current.update(words)
                else:  # English is handled better, as we can check for Nouns and other stuff.
                    sentences = nltk.sent_tokenize(message, language=language)
                    # Tokenize the message based on language.
                    tokens = [nltk.word_tokenize(sentence, language=language) for sentence in sentences]

                    filtered_tokens = []

                    for token_list in tokens:
                        filtered_tokens.extend([word for word in token_list if word.lower() not in filter_current])

                    pos_tags = nltk.pos_tag(filtered_tokens, lang="eng")

                    words = [word for word, pos in pos_tags if pos in ['NN', 'NNS', 'NNP', 'NNPS'] and len(word) > 3]

                    counter_current.update(words)

            except (FDLanguageNotSupported, FDEmptyMessage) as error:
                if verbose:
                    print(error)

    # Update combined counters for each language.
    for language in counters.keys():
        for message_type in counters[language].keys():
            if message_type != "combined":
                counters[language]["combined"].update(counters[language][message_type])

    # Update combined counter for all words together.
    all_word_counter = Counter()
    for language in counters.keys():
        all_word_counter.update(counters[language]["combined"])

    return counters, all_word_counter

def print_counters(language, message_type, counters, how_many=None):
        counter = get_counter(language, message_type, counters, how_many)
        for word, count in counter:
            print(f"{word}: {count}")

def get_counter(language, message_type, counters, how_many=None, verbose=False):
    if language in counters and message_type in counters[language]:
        if how_many:
            return counters[language][message_type].most_common(how_many)
        else:
            return counters[language][message_type]
    else:
        lang_ok = True if language in counters else False
        type_ok = True if message_type in counters[language] else False
        if verbose:
            print(f"Invalid language or message type. Language ok?: {lang_ok}, Type ok?: {type_ok}")