import os
import requests
from dotenv import load_dotenv


class PosthogExtractor:
    def __init__(self):
        load_dotenv()
        self.project_id = os.getenv("POSTHOG_PROJECT_ID", "")
        self.read_api_key = os.getenv("POSTHOG_READ_API_KEY", "")

        if not self.project_id or not self.read_api_key:
            raise ValueError(
                "Missing PostHog configuration. Ensure POSTHOG_PROJECT_ID and POSTHOG_READ_API_KEY are set in the environment."
            )
        self.api_url = f"https://eu.posthog.com/api/projects/{self.project_id}/query/"

    def get_form_events(self):
        event_types = [
            "send_program_form",
            "send_project_form",
            "send_program_form_catalog",
            "send_project_form_catalog",
            "send_customProject_form",
        ]
        return self.get_events(event_types)

    def get_siret_events(self, start_date, end_date):
        """Get siret events between 2 Datetime()"""
        return self.get_events(
            ["register_siret_modal", "register_siret_tracks"],
            start_date.strftime("%Y-%m-%d %H:%M:%S"),
            end_date.strftime("%Y-%m-%d %H:%M:%S"),
        )

    def get_events(self, event_types, start_date=None, end_date=None):
        event_list = ", ".join([f"'{event}'" for event in event_types])
        hogql_query = f"SELECT * FROM events WHERE event IN ({event_list})"
        if start_date and end_date:
            hogql_query += (
                f" AND timestamp > '{start_date}' AND timestamp <= '{end_date}'"
            )
        hogql_query += " LIMIT 10000"
        return self.execute_hogql_query(hogql_query)

    def get_unique_visitors_by_date_range(self, start_date, end_date):
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
        return self.execute_hogql_query(hogql_query)

    def execute_hogql_query(self, query_text):
        payload = {"query": {"kind": "HogQLQuery", "query": query_text}}
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.read_api_key}",
        }

        try:
            response = requests.post(self.api_url, json=payload, headers=headers)
            response.raise_for_status()  # Raise an error for HTTP errors (4xx, 5xx)
            return response.json()
        except Exception as error:
            print("Error fetching events from PostHog:", error)
            return []

    def get_external_link_click_events(self, start_date, end_date):
        return self.get_events(["external_link_clicked_v2"], start_date, end_date)

    def get_detail_page_view_events(self, start_date, end_date):
        return self.get_events(["detail_page_view"], start_date, end_date)

    def get_unique_visitors_detail_page_view_by_date_range(self, start_date, end_date):
        hogql_query = f"""
            SELECT
                toStartOfDay(timestamp) AS event_date,
                COUNT(DISTINCT person_id) AS unique_visitors
            FROM events
            WHERE timestamp > '{start_date}'
            AND timestamp <= '{end_date}'
            AND event = 'detail_page_view'
            GROUP BY event_date
            ORDER BY event_date ASC
        """
        return self.execute_hogql_query(hogql_query)
