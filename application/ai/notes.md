- Had issues installing safetensors; was issue with maintainer. Fixed now.
- Needed to install SpaCy: 
    pip3 install spacy
    python3 -m spacy download en_core_web_sm
    python3 -m spacy download nl_core_news_sm

- Nice blog from picnic on NLE/NLP: https://blog.picnic.nl/machine-learning-and-customer-success-automated-feedback-classification-part-2-97102813c133
- Spacy inspiration: https://towardsdatascience.com/named-entity-recognition-with-nltk-and-spacy-8c4a7d88e7da
- NOTE: SpaCy is slow?
- For Excel reading students:
pip3 install pandas openpyxl fuzzywuzzy



How to extract feedback automatically (according to ChatGPT):

Automatic feedback extraction involves processing a collection of text messages to extract meaningful insights, sentiments, and trends. Here's a general approach you can take using natural language processing (NLP) techniques:

1. **Data Preprocessing**:
   Clean and preprocess the text messages to remove noise and irrelevant information. This may include removing special characters, stopwords, and performing text normalization (lowercasing, stemming, etc.).

2. **Tokenization**:
   Tokenize the preprocessed messages into words or phrases. This step breaks down sentences into smaller units that can be processed by NLP algorithms.

3. **Sentiment Analysis**:
   Perform sentiment analysis on the messages to determine whether the feedback is positive, negative, or neutral. You can use pre-trained sentiment analysis models, such as VADER (included in NLTK) or other sentiment analysis libraries like TextBlob or Transformers.

4. **Named Entity Recognition (NER)**:
   Extract named entities like course names, instructors, and specific topics mentioned in the feedback. This can help categorize feedback and identify trends related to different aspects.

5. **Topic Modeling**:
   Apply topic modeling techniques like Latent Dirichlet Allocation (LDA) or Non-Negative Matrix Factorization (NMF) to identify common themes or topics in the feedback. This can help you understand what aspects of the course are being discussed.

6. **Keyword Extraction**:
   Extract important keywords from the feedback using techniques like TF-IDF (Term Frequency-Inverse Document Frequency) or TextRank. This can help you identify frequently mentioned terms.

7. **Word Embeddings**:
   Use word embeddings like Word2Vec or FastText to capture semantic relationships between words. This can help you understand the context in which words are used.

8. **Data Visualization**:
   Create visualizations like word clouds, bar charts, and sentiment distribution plots to summarize and communicate insights from the feedback data.

9. **Classification**:
   If you're interested in categorizing feedback into specific classes (e.g., technical issues, content quality), you can use supervised classification algorithms trained on labeled examples.

10. **Feedback Summarization**:
    Automatically generate summarized versions of lengthy feedback using extractive or abstractive summarization techniques.

11. **Feedback Trends and Patterns**:
    Analyze feedback over time to identify trends and patterns, helping you make informed decisions for course improvements.

Remember that feedback extraction is not a one-size-fits-all process, as it depends on the characteristics of your data and your specific goals. You may need to experiment with different NLP techniques and tools to find the best approach for your use case.