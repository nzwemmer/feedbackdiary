import os
from application.ai.models.models import model_list

def download_models():
    for model_name, [tokenizer_class, model_class] in model_list.items():
        model_path = f"models/{model_name}"
        if not os.path.exists(model_path):
            # Download the tokenizer and model
            tokenizer = tokenizer_class.from_pretrained(model_name)
            model = model_class.from_pretrained(model_name)

            # Save the tokenizer and model for offline usage
            tokenizer.save_pretrained(model_path + "/tokenizer")
            model.save_pretrained(model_path + "/model")
