import requests
import os
from dotenv import load_dotenv


class BaserowExtractor():
    BASE_URL = "https://api.baserow.io/api/database/rows/table/"
    PROJECT_TABLE_ID = 305253
    PROGRAM_TABLE_ID = 314437

    def __init__(self):
        load_dotenv()
        self._headers = {"Authorization": f"Token {os.getenv('BASEROW_TOKEN')}"}

    def _get_table_data(self, table_id):
        """Fetch all rows from a Baserow table."""
        url = f"{self.BASE_URL}{table_id}/?user_field_names=true"
        results = []
        while url:
            response = requests.get(url, headers=self._headers)
            response.raise_for_status()
            data = response.json()
            results.extend(data.get("results", []))
            url = data.get("next")
        return results

    def get_projects(self):
          return self._get_table_data(self.PROJECT_TABLE_ID)

    def get_programs(self):
          return self._get_table_data(self.PROGRAM_TABLE_ID)

