from etl.extract.db_queries import get_new_sirets
from etl.transform.establishment import (
    keep_valid_sirets,
    siren_establishment_to_db_establishment,
)
from etl.extract.siren import SireneAPIClient
from etl.load.companies import insert_companies

class CompaniesPipeline:
    def process_new_sirets(self):
        sirets = get_new_sirets()
        valid_sirets = keep_valid_sirets(sirets)
        if not valid_sirets:
            print("No new SIRETs to process.")
        else:
            print(len(valid_sirets), "sirets to query and insert")

        for siret in valid_sirets:
            try:
                establishment = SireneAPIClient().get_establishment_sirene(siret)
                company = siren_establishment_to_db_establishment(establishment)
                insert_companies([company])
            except Exception as e:
                print(f"Failed to process siret {siret}: {e}")
