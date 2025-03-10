from etl.transform.daily_web_stat import DailyWebStat
from etl.tools.db_manager import DBManager


def insert_daily_web_stats(web_stats: list[DailyWebStat]):
    if not len(web_stats):
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.daily_web_stats (stat_date, unique_visitors)
        VALUES (%s, %s)
        ON CONFLICT (stat_date) DO NOTHING;
    """
    values = [(daily_data.date, daily_data.visit_count) for daily_data in web_stats]

    try:
        DBManager().query(query, values)
    except Exception as error:
        print("SIRET event insertion error:", error)
