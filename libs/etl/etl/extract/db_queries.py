from etl.tools.db_manager import DBManager


def get_new_sirets():
    query = """
            SELECT DISTINCT siret FROM __SCHEMA_NAME__.web_registered_siret
            UNION
            SELECT DISTINCT company_siret FROM __SCHEMA_NAME__.opportunities
            EXCEPT
            SELECT DISTINCT siret FROM __SCHEMA_NAME__.companies;
        """
    # TODO create an "unknown SIRET table" to avoid requerying all the time the SIRET not found in the siren api.
    try:
        result = DBManager().query(query)
        return [row[0] for row in result]
    except Exception as e:
        print(f"Error fetching new SIRETs: {e}")
        return []


def get_last_webstat_date():
    ### Get the last date in the daily web stats format. Return a YYYY-MM-DD STRING ###
    result = DBManager().query(
        "SELECT stat_date FROM __SCHEMA_NAME__.daily_web_stats ORDER BY stat_date DESC LIMIT 1"
    )
    return result[0][0] if result else None


def get_last_siret_event_date():
    ### Get the last date in the daily web stats format. Return a %Y-%m-%d %H:%M:%S STRING ###
    result = DBManager().query(
        "SELECT MAX(date) AS last_date FROM __SCHEMA_NAME__.web_registered_siret;"
    )
    return result[0][0]


def get_last_click_event_date():
    ### Get the last date in the click event date table. Return a %Y-%m-%d %H:%M:%S STRING ###
    result = DBManager().query(
        "SELECT MAX(date) AS last_date FROM __SCHEMA_NAME__.external_link_clicked_events;"
    )
    return result[0][0]


def get_last_detail_page_view_event_date():
    ### Get the last date in the click event date table. Return a %Y-%m-%d %H:%M:%S STRING ###
    result = DBManager().query(
        "SELECT MAX(date) AS last_date FROM __SCHEMA_NAME__.detail_page_view;"
    )
    return result[0][0]


def get_invalid_sirets():
    result = DBManager().query(
        """SELECT siret FROM __SCHEMA_NAME__.siret_search_error
        WHERE fail_count >=5;"""
    )
    return [row[0] for row in result]
