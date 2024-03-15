import pandas as pd
from fuzzywuzzy import fuzz
from application.ai.setup.nltk_setup import nltk_setup
from nltk.corpus import words

def remove_names_from_message(message, names_list, verbose=False):
    _, _, common_words_english = nltk_setup()  # TODO: make class instead, such that redownload is not always triggered.
    cleaned_text = message.lower()
    result_tokens = cleaned_text.split()  # Split the text into tokens

    for name in names_list:
        # Check for case-insensitive match of first name using fuzzywuzzy
        first_name, last_name = name.split()[0], name.split()[-1]
        for i, token in enumerate(result_tokens):
            if verbose:
                print(f"Name: {first_name} {last_name}, Token: {token}, Score FN: {fuzz.token_set_ratio(first_name, token)}, Score LN: {fuzz.token_set_ratio(last_name, token)}")
            if fuzz.token_set_ratio(last_name, token) > 75 or fuzz.token_set_ratio(first_name, token) >= 75:
                if token not in common_words_english:
                    result_tokens[i] = '<sodm>'

    new_message = ' '.join(result_tokens)
    return new_message