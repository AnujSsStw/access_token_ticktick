import requests
from typing import Callable, List

ACCESS_TOKEN = None


def get_ticktick_access_token():
    global ACCESS_TOKEN
    if ACCESS_TOKEN:
        return ACCESS_TOKEN
    client_id = "qSba4cM39GW0tCAKSj"
    client_secret = "19vSjUGy&L4fM75c%T@kE2(Pp+y@PiJe"

    # OAuth2 authentication flow
    authorization_url = (
        f"https://ticktick.com/oauth/authorize?client_id={client_id}&response_type=code"
    )
    print("Please visit the following URL and authorize the application:")
    print(authorization_url)
    authorization_code = input("Enter the authorization code: ")

    # Exchange authorization code for an access token
    token_url = "https://ticktick.com/oauth/token"
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": authorization_code,
        "grant_type": "authorization_code",
    }
    response = requests.post(token_url, data=data)
    access_token = response.json()["access_token"]
    ACCESS_TOKEN = access_token
    return access_token


def call_ticktick(path: str, http_method: Callable, body: dict = None):
    access_token = "a318c416-4bbd-4459-8c68-7f38c8f29166"
    headers = {"Authorization": f"Bearer {access_token}"}
    kwargs = {"headers": headers}
    if body:
        kwargs["body"] = body
    response = http_method(f"https://api.ticktick.com/open/v1/{path}", **kwargs)
    return response.json()


def get_user_project():
    return call_ticktick("project", requests.get)


def get_project(project_id: str):
    return call_ticktick(f"project/{project_id}", requests.get)


def get_project_with_data(project_id: str):
    return call_ticktick(f"project/{project_id}/data", requests.get)


def get_task(project_id: str, task_id: str):
    return call_ticktick(f"project/{project_id}/task/{task_id}", requests.get)


def complete_task(project_id: str, task_id: str):
    return call_ticktick(f"project/{project_id}/task/{task_id}/complete", requests.post)


print(get_user_project())
print(get_project_with_data("67669b188f08288435f82763"))
