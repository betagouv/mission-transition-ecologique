import requests
import json
from etl.tools.config.config import Config
from etl.tools.config.config_baserow import ConfigBaserow


class BaserowExtractor:
    BASE_URL = "https://api.baserow.io/api/database/rows/table/"
    PROJECT_TABLE_ID = ConfigBaserow.PROJECT_TABLE_ID()
    PROGRAM_TABLE_ID = ConfigBaserow.PROGRAM_TABLE_ID()
    BASEROW_TOKEN = Config.BASEROW_TOKEN()

    def __init__(self):
        self._headers = {"Authorization": f"Token {self.BASEROW_TOKEN}"}

    def _get_table_data(self, table_id, params=None):
        """Fetch all rows from a Baserow table."""
        url = f"{self.BASE_URL}{table_id}/?user_field_names=true"
        results = []
        while url:
            response = requests.get(url, headers=self._headers, params=params)
            response.raise_for_status()
            data = response.json()
            results.extend(data.get("results", []))
            url = data.get("next")
        return results

    def get_projects(self):
        return self._get_table_data(self.PROJECT_TABLE_ID)

    def get_programs(self):
        return self._get_table_data(self.PROGRAM_TABLE_ID)

    def get_in_prod_projects(self):
        filter_obj = {
            "filter_type": "AND",
            "filters": [
                {"type": "single_select_equal", "field": "Statut", "value": "En prod"}
            ]
        }
        params = {"filters": json.dumps(filter_obj)}
        return self._get_table_data(self.PROJECT_TABLE_ID, params=params)

    def get_in_prod_programs(self):
        filter_obj = {
            "filter_type":"AND",
            "filters":[
                {"type":"multiple_select_has","field":"Statuts","value":"1724688,2426619"}
            ]}

        params = {"filters": json.dumps(filter_obj)}
        return self._get_table_data(self.PROGRAM_TABLE_ID, params=params)
