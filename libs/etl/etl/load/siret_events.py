from etl.transform.siret_event import SiretEvent
from etl.tools.db_manager import DBManager
from etl.tools.db_structure import TableName


def insert_siret_events(events: list[SiretEvent]):
    if not len(events):
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.{TableName.WEB_REGISTERED_SIRET} (
            {SiretEvent.DATE},
            {SiretEvent.SIRET}
        )
        VALUES (%s, %s)
        ON CONFLICT ({SiretEvent.DATE}, {SiretEvent.SIRET}) DO NOTHING;
    """
    values = [(event.date, event.siret) for event in events]

    try:
        DBManager().query(query, values)
    except Exception as error:
        print("SIRET event insertion error:", error)
