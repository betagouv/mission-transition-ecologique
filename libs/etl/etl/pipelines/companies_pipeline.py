from etl.extract.db_queries import get_new_sirets
from etl.transform.establishment import (
    keep_valid_sirets,
    siren_establishment_to_db_establishment,
)
from etl.extract.siren import SireneAPIClient
from etl.load.companies_insert import insert_companies
from dotenv import load_dotenv
import os

class CompaniesPipeline:
    def process_new_sirets(self):
        sirets = get_new_sirets()
        valid_sirets = keep_valid_sirets(sirets)
        if not valid_sirets:
            print("No new SIRETs to process.")
            return
        load_dotenv()
        if os.getenv("TEST") == "True":
            valid_sirets = valid_sirets[:10]

        batch_size = 5
        for i in range(0, len(valid_sirets), batch_size):
            batch = valid_sirets[i : i + batch_size]
            try:
                establishments = SireneAPIClient().get_establishments(batch)
                companies = [
                    siren_establishment_to_db_establishment(est)
                    for est in establishments
                ]
                insert_companies(companies)
                print(f"Successfully processed batch {i // batch_size + 1}")
            except Exception as e:
                print(f"Failed to process batch {i // batch_size + 1}: {e}")
