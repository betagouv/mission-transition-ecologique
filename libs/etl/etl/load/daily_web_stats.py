from etl.transform.daily_web_stat import DailyWebStat
from etl.tools.db_manager import DBManager
from etl.tools.db_structure import TableName


def insert_daily_web_stats(web_stats: list[DailyWebStat]):
    if not len(web_stats):
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.{TableName.DAILY_WEB_STATS} (
            {DailyWebStat.STAT_DATE},
            {DailyWebStat.UNIQUE_VISITORS},
            {DailyWebStat.DETAIL_PAGE_UNIQUE_VISITORS}
        )
        VALUES (%s, %s, %s)
        ON CONFLICT ({DailyWebStat.STAT_DATE}) DO NOTHING;
    """
    values = [
        (
            daily_data.date,
            daily_data.visit_count,
            daily_data.detail_page_visit_count,
        )
        for daily_data in web_stats
    ]

    try:
        DBManager().query(query, values)
    except Exception as error:
        print("SIRET event insertion error:", error)
