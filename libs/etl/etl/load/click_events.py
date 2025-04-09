from etl.tools.db_manager import DBManager
from etl.transform.click_event import ClickEvent
from etl.tools.db_structure import TableName

def insert_click_events(events: list[ClickEvent]):
    if not len(events):
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.{TableName.EXTERNAL_LINK_CLICKED_EVENTS} (
            {ClickEvent.SIRET},
            {ClickEvent.HYBRID_COMPANY_ID},
            {ClickEvent.CUSTOM_COMPANY_ID},
            {ClickEvent.DATE},
            {ClickEvent.TYPE},
            {ClickEvent.TITLE},
            {ClickEvent.CURRENT_URL},
            {ClickEvent.LINK},
            {ClickEvent.EVENT_ID},
            {ClickEvent.WEB_USER_ID}
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT ({ClickEvent.EVENT_ID}) DO NOTHING
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
        print("Click event insertion error:", error)
