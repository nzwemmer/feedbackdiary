import spacy
import nltk
from nltk.chunk import ne_chunk
from nltk.tag import pos_tag

def nltk_setup():
    # Used for nltk name detection.
    nltk.download('averaged_perceptron_tagger')
    nltk.download('maxent_ne_chunker')
    nltk.download('words')


def detect_names_nltk(tokens):
    tagged = pos_tag(tokens)
    named_entities = ne_chunk(tagged)

    persons = []

    for entity in named_entities:
        if isinstance(entity, nltk.tree.Tree) and entity.label() == 'PERSON':
            person_name = ' '.join([leaf[0] for leaf in entity.leaves()])
            persons.append(person_name)
    return persons

def detect_names_spacy(message, language):
    # Load the spaCy model
    nlp_en = spacy.load("en_core_web_sm")
    nlp_nl = spacy.load("nl_core_news_sm")

    if language == "english":
        doc = nlp_en(message)
    elif language == "dutch":
        doc = nlp_nl(message)
    else:
        raise ValueError("Language not supported")

    persons = []

    for entity in doc.ents:
        if entity.label_ == "PERSON":
            persons.append(entity.text)

    return persons

if __name__ == "__main__":
    nltk_setup()