import json
import os
import requests

fd_config = {
    "urls": ["https://knp.feedbackdiary.nl/", "https://ssvt.feedbackdiary.nl/"],  # Add if other FD required.
    "token": os.getenv("FD_TOKEN"),
    "password": os.getenv("FD_PASSWORD")
}

fd_config_v1_2 = {
    "urls": ["https://pse.feedbackdiary.nl/"],  # Add if other FD required. Use only v3 version of FD.
    "user_token": os.getenv("FD_TOKEN"),
    "password": os.getenv("FD_PASSWORD_v1_2")
}

def process(base_url, version="latest"):
    # Create a session object to persist cookies
    session = requests.Session()

    if version == "1.3":
        token_str = "user_token"
        password_str = "password"
        token = fd_config_v1_2[token_str]
        password = fd_config_v1_2[password_str]
    else:
        token_str = "token"
        password_str = "password"
        token = fd_config[token_str]
        password = fd_config[password_str]

    # 1. Authentication call
    auth_url = base_url + "functions/login.php"
    auth_data = {token_str: token, password_str: password}

    try:
        session.post(auth_url, data=auth_data)
    except requests.exceptions.RequestException as e:
        print(f"An error occurred during authentication: {str(e)}")

    # 2. Download JSON data
    download_url = base_url + "functions/download.php"

    try:
        download_response = session.post(download_url)

        if download_response.status_code == 200:
            try:
                return download_response.json()
            except json.decoder.JSONDecodeError as json_err:
                print(f"Error decoding JSON: {str(json_err)}")
        else:
            print(f"Downloading JSON data failed with status code {download_response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while downloading JSON data: {str(e)}")

    # 3. Logout
    logout_url = base_url + "functions/logout.php"

    try:
        logout_response = session.post(logout_url)

        if logout_response.content == "Logged out sucessfully!".encode():
            print("Logout successful")
        else:
            print(f"Logout failed with content: {logout_response.content}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred during logout: {str(e)}")

    return None

def download_entries():
    results = {}

    for base_url in fd_config_v1_2["urls"]:
        url = base_url.replace("https://", "")
        course = url.replace(".feedbackdiary.nl/", "")
        result = process(base_url, version="1.3")
        if result:
            results[course.upper()] = result

    for base_url in fd_config["urls"]:
        url = base_url.replace("https://", "")
        course = url.replace(".feedbackdiary.nl/", "")
        result = process(base_url)
        if result:
            results[course.upper()] = result

    return results