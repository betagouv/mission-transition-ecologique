from etl.tools.db_manager import DBManager
from etl.transform.click_event import ClickEvent


def insert_click_events(events: list[ClickEvent]):
    if not len(events):
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.external_link_clicked_events (siret, hybrid_company_id, custom_company_id, date, type, title, current_url, link, event_id, web_user_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (event_id) DO NOTHING
    """
    values = [
        (
            event.siret,
            event.hybrid_company_id,
            event.custom_company_id,
            event.date,
            event.type,
            event.title,
            event.current_url,
            event.link,
            event.event_id,
            event.web_user_id,
        )
        for event in events
    ]
    try:
        DBManager().query(query, values)
    except Exception as error:
        print("SIRET event insertion error:", error)
