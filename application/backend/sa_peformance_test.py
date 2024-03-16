from application.ai.utility import sentiment_analysis

overwrite = False
verbose = True  # Verbose is false for API call, can be set to True for debugging.

course = "PSE"
sentiment_type = "AI"

data_path = f"../data/{course}"
read_paths = [f"{data_path}/{path}" for path in ["students.xlsx", "teachers.xlsx", "entries.json"]]
store_paths = [f"{data_path}/{path}" for path in ["sentiment_student.json", "sentiment_ai.json", "accuracy.json"]]

ai = True
overwrite = True

student_sentiment, ai_sentiment, accuracy, modify_date_student, modify_date_ai = sentiment_analysis.run_sentiment_analysis(course, read_paths, store_paths, ai, verbose, overwrite)
