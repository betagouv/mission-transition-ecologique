from etl.tools.db_manager import DBManager
from dotenv import load_dotenv


def get_new_sirets():
    query = """
            SELECT DISTINCT siret FROM statistics.web_registered_siret
            UNION
            SELECT DISTINCT company_siret FROM statistics.opportunities
            EXCEPT
            SELECT DISTINCT siret FROM statistics.companies;
        """
    # TODO create an "unknown SIRET table" to avoid requerying all the time the SIRET not found in the siren api.
    try:
        result = DBManager().query(query)
        return [row[0] for row in result]
    except Exception as e:
        print(f"Error fetching new SIRETs: {e}")
        return []
