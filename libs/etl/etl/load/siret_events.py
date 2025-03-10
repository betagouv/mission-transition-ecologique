from etl.transform.siret_event import SiretEvent
from etl.tools.db_manager import DBManager


def insert_siret_events(events: list[SiretEvent]):
    if not len(events):
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.web_registered_siret (date, siret)
        VALUES (%s, %s)
        ON CONFLICT (date, siret) DO NOTHING;
    """
    values = [(event.date, event.siret) for event in events]

    try:
        DBManager().query(query, values)
    except Exception as error:
        print("SIRET event insertion error:", error)
