# import pandas as pd
# from posthog import Posthog
# import requests
# import json

# df = pd.read_csv("deals_with_contact_info.csv")
# print(df.columns)


# def read_env(name, path) -> str:
#     """Reads Brevo API key from the specified file."""
#     try:
#         with open(path, "r") as file:
#             lines = file.readlines()
#         for line in lines:
#             if line.startswith(name):
#                 env_value = line.split("=")[1].strip()
#                 return env_value
#         print("error while looking for", name, "in the env file")
#     except:
#         print("error while looking for", name, "in the env file")


# POSTHOG_PROJECT_ID = read_env("POSTHOG_PROJECT_ID", "../../.env")
# POSTHOG_API_KEY = read_env("POSTHOG_API_KEY", "../../.env")

# print(POSTHOG_API_KEY)
# print(POSTHOG_PROJECT_ID)

# url = f"https://eu.posthog.com/api/projects/{POSTHOG_PROJECT_ID}/query/"
# headers = {
#     "Content-Type": "application/json",
#     "Authorization": f"Bearer {POSTHOG_API_KEY}",
# }

# event_types = ["send_program_form", "send_project_form", "send_program_form_catalog"]

# hogql_query = f"""
#     SELECT *
#     FROM events
#     WHERE event IN ({', '.join(f"'{event}'" for event in event_types)})
# """

# # Build the query payload
# payload = {"query": {"kind": "HogQLQuery", "query": hogql_query}}
# # payload = {
# #     "query": {
# #         "kind": "HogQLQuery",
# #         "query": "select * from events",
# #     }
# # }
# response = requests.post(url, headers=headers, data=json.dumps(payload))
# data = response.json()
# with open("posthog_data_event.json", "w") as json_file:
#     json.dump(data, json_file, indent=4)

import json

with open("posthog_data_event.json", "r") as file:
    data = json.load(file)
if "results" in data:
    num_elements = len(data["results"])
    print(f"Number of events in the 'results' array: {num_elements}")
else:
    print("'results' key not found in the JSON data.")
