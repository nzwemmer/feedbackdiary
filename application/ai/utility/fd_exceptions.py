class FDLanguageNotSupported(Exception):
    def __init__(self, language, message):
        super().__init__(f"FeedbackDiary: Language '{language}' is not supported. Message = '{message}'")

class FDEmptyMessage(Exception):
    def __init__(self):
        super().__init__("FeedbackDiary: This message was left empty.")
