from fuzzywuzzy import fuzz
from application.ai.setup.nltk_setup import nltk_setup
from application.ai.utility.common import create_filters


def remove_names_from_message(message, names_list, verbose=False):
    stop_words_en, stop_words_nl, common_words_english = nltk_setup()
    cleaned_text = message.lower()
    result_tokens = cleaned_text.split()  # Split the text into tokens
    custom_filter_en, custom_filter_nl = create_filters(stop_words_en, stop_words_nl)

    for name in names_list:
        # Check for case-insensitive match of first name using fuzzywuzzy
        first_name, last_name = name.split()[0], name.split()[-1]
        for i, token in enumerate(result_tokens):
            if verbose:
                print(f"Name: {first_name} {last_name}, Token: {token}, Score FN: {fuzz.token_set_ratio(first_name, token)}, Score LN: {fuzz.token_set_ratio(last_name, token)}")
            if fuzz.token_set_ratio(last_name, token) > 75 or fuzz.token_set_ratio(first_name, token) >= 75:
                if token not in common_words_english or token in custom_filter_en or token in custom_filter_nl:
                    result_tokens[i] = '<REDACTED>'
                else:
                    if verbose:
                        print(f"Name {token} not filtered, is common English word.")

    new_message = ' '.join(result_tokens)
    return new_message
