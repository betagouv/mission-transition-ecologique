import os
import requests
from dotenv import load_dotenv


class PosthogManager:
    def __init__(self):
        load_dotenv()
        self.project_id = os.getenv("POSTHOG_PROJECT_ID", "")
        self.read_api_key = os.getenv("POSTHOG_READ_API_KEY", "")

        if not self.project_id or not self.read_api_key:
            raise ValueError(
                "Missing PostHog configuration. Ensure POSTHOG_PROJECT_ID and POSTHOG_READ_API_KEY are set in the environment."
            )

    def get_form_events(self):
        print("in posthog manager form event")
        event_types = [
            "send_program_form",
            "send_project_form",
            "send_program_form_catalog",
            "send_project_form_catalog",
            "send_customProject_form",
        ]
        return self.get_events(event_types)

    def get_siret_events(self, start_date, end_date):
        """Get siret events between 2 Dates()"""
        return self.get_events(
            ["register_siret_modal", "register_siret_tracks"],
            start_date.strftime("%Y-%m-%d %H:%M:%S"),
            end_date.strftime("%Y-%m-%d %H:%M:%S"),
        )

    def get_events(self, event_types, start_date=None, end_date=None):
        api_url = f"https://eu.posthog.com/api/projects/{self.project_id}/query/"

        hogql_query = f"""
            SELECT *
            FROM events
            WHERE event IN ({", ".join([f"'{event}'" for event in event_types])})
            LIMIT 10000
        """

        if start_date and end_date:
            hogql_query = f"""
                SELECT *
                FROM events
                WHERE event IN ({", ".join([f"'{event}'" for event in event_types])})
                AND timestamp > '{start_date}'
                AND timestamp <= '{end_date}'
                LIMIT 10000
            """

        payload = {"query": {"kind": "HogQLQuery", "query": hogql_query}}
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.read_api_key}",
        }

        try:
            response = requests.post(api_url, json=payload, headers=headers)
            response.raise_for_status()  # Raise an error for HTTP errors (4xx, 5xx)
            data = response.json()
            return data
        except requests.RequestException as error:
            print("Error fetching events from PostHog:", error)
            return []

    def get_unique_visitors_by_date_range(self, start_date, end_date):
        api_url = f"https://eu.posthog.com/api/projects/{self.project_id}/query/"

        hogql_query = ""
        if start_date and end_date:
            hogql_query = f"""
                SELECT
                    toStartOfDay(timestamp) AS event_date,
                    COUNT(DISTINCT person_id) AS unique_visitors
                FROM events
                WHERE timestamp > '{start_date}'
                AND timestamp <= '{end_date}'
                AND event = '$pageview'
                GROUP BY event_date
                ORDER BY event_date ASC
            """

        payload = {"query": {"kind": "HogQLQuery", "query": hogql_query}}
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.read_api_key}",
        }

        try:
            response = requests.post(api_url, json=payload, headers=headers)
            data = response.json()
            return data
        except Exception as error:
            print("Error fetching events from PostHog:", error)

        return []

    # def get_status_event(self):
    #     event_types = [
    #         f"brevo_status_set_to_{key}" for key in DealStage.__dict__.keys()
    #     ]
    #     return self.get_events(event_types)
