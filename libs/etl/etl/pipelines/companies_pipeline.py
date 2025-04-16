from etl.extract.db_queries import get_new_sirets
from etl.transform.establishment import siren_establishment_to_db_establishment
from etl.transform.siret_search_error import SiretSearchError
from etl.extract.siren_extractor import SireneExtractor
from etl.load.companies import insert_companies, insert_siren_error
import time

class CompaniesPipeline:
    def process_new_sirets(self):
        sirets = get_new_sirets()
        valid_sirets = SiretSearchError.keep_valid_sirets(sirets)
        if not valid_sirets:
            print("No new SIRETs to process.")
        else:
            print(len(valid_sirets), "sirets to query and insert")

        for siret in valid_sirets:
            try:
                establishment = SireneExtractor().get_establishment_sirene(siret)
                company = siren_establishment_to_db_establishment(establishment)
                insert_companies([company])
            except Exception as e:
                print(f"Failed to process siret {siret}: {e}")
                insert_siren_error(siret)
            time.sleep(3)
