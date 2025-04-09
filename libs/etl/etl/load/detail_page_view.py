from etl.tools.db_manager import DBManager
from etl.transform.detail_page_view_event import DetailPageViewEvent


def insert_detail_page_view_events(events: list[DetailPageViewEvent]):
    if not len(events):
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.detail_page_view (
            {DetailPageViewEvent.SIRET},
            {DetailPageViewEvent.HYBRID_COMPANY_ID},
            {DetailPageViewEvent.CUSTOM_COMPANY_ID},
            {DetailPageViewEvent.DATE},
            {DetailPageViewEvent.TYPE},
            {DetailPageViewEvent.TITLE},
            {DetailPageViewEvent.CURRENT_URL},
            {DetailPageViewEvent.EVENT_ID},
            {DetailPageViewEvent.WEB_USER_ID}
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT ({DetailPageViewEvent.EVENT_ID}) DO NOTHING
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
            event.event_id,
            event.web_user_id,
        )
        for event in events
    ]
    try:
        DBManager().query(query, values)
    except Exception as error:
        print("SIRET event insertion error:", error)
