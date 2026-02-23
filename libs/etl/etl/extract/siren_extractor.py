import requests
from etl.tools.config.config import Config
import time


class SireneExtractor:
    def __init__(self):
        self.api_url = "https://api.insee.fr/api-sirene/3.11/siret/"
        self.token = Config.SIRENE_API_311_TOKEN()

    def get_establishment_sirene(self, siret):
        """Fetch establishment details for a given SIRET."""
        try:
            response = requests.get(
                f"{self.api_url}{siret}",
                headers={
                    "content-type": "application/json",
                    "accept": "application/json",
                    "X-INSEE-Api-Key-Integration": self.token,
                },
                timeout=3,
            )
            response.raise_for_status()
            return response.json()
        except Exception as err:
            return {"siret": siret, "error": str(err)}

    def get_establishments(self, sirets):
        """Fetch establishment details for multiple SIRETs with a delay between each request."""
        establishments = []
        for siret in sirets:
            establishments.append(self.get_establishment_sirene(siret))
            time.sleep(3)
        return establishments
