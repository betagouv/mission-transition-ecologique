from etl.tools.db_manager import DBManager


def get_new_sirets():
    query = """
            SELECT DISTINCT siret FROM __SCHEMA_NAME__.web_registered_siret
            UNION
            SELECT DISTINCT company_siret FROM __SCHEMA_NAME__.opportunities
            EXCEPT
            SELECT DISTINCT siret FROM __SCHEMA_NAME__.companies;
        """
    try:
        result = DBManager().query(query)
        return [row[0] for row in result]
    except Exception as e:
        print(f"Error fetching new SIRETs: {e}")
        return []


def get_max(table, column):
    result = DBManager().query(
        "SELECT MAX(" + column + ") FROM __SCHEMA_NAME__." + table + ";"
    )
    return result[0][0]


def get_last_webstat_date():
    ### Get the last date in the daily web stats format. Return a YYYY-MM-DD STRING ###
    return get_max("daily_web_stats", "stat_date")


def get_last_siret_event_date():
    ### Get the last date in the daily web stats format. Return a %Y-%m-%d %H:%M:%S STRING ###
    return get_max("web_registered_siret", "date")


def get_last_click_event_date():
    ### Get the last date in the click event date table. Return a %Y-%m-%d %H:%M:%S STRING ###
    return get_max("external_link_clicked_events", "date")


def get_last_detail_page_view_event_date():
    ### Get the last date in the click event date table. Return a %Y-%m-%d %H:%M:%S STRING ###
    return get_max("detail_page_view", "date")


def get_invalid_sirets():
    result = DBManager().query(
        """SELECT siret FROM __SCHEMA_NAME__.siret_search_error
        WHERE fail_count >=5;"""
    )
    return [row[0] for row in result]
