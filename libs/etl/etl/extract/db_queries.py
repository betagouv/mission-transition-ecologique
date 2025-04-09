from etl.tools.db_manager import DBManager
from etl.transform.siret_event import SiretEvent
from etl.transform.deals import Deal
from etl.transform.daily_web_stat import DailyWebStat
from etl.transform.click_event import ClickEvent
from etl.transform.detail_page_view_event import DetailPageViewEvent
from etl.tools.db_structure import TableName, CompaniesColumn, SiretSearchErrorColumn

def get_new_sirets():
    query = f"""
            SELECT DISTINCT {SiretEvent.SIRET} FROM __SCHEMA_NAME__.{TableName.WEB_REGISTERED_SIRET}
            UNION
            SELECT DISTINCT {Deal.COMPANY_SIRET} FROM __SCHEMA_NAME__.{TableName.OPPORTUNITIES}
            EXCEPT
            SELECT DISTINCT {CompaniesColumn.SIRET} FROM __SCHEMA_NAME__.{TableName.COMPANIES};
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
    return get_max(TableName.DAILY_WEB_STATS, DailyWebStat.STAT_DATE)


def get_last_siret_event_date():
    ### Get the last date in the daily web stats format. Return a %Y-%m-%d %H:%M:%S STRING ###
    return get_max(TableName.WEB_REGISTERED_SIRET, SiretEvent.DATE)


def get_last_click_event_date():
    ### Get the last date in the click event date table. Return a %Y-%m-%d %H:%M:%S STRING ###
    return get_max(TableName.EXTERNAL_LINK_CLICKED_EVENTS, ClickEvent.DATE)


def get_last_detail_page_view_event_date():
    ### Get the last date in the click event date table. Return a %Y-%m-%d %H:%M:%S STRING ###
    return get_max(TableName.DETAIL_PAGE_VIEW, DetailPageViewEvent.DATE)


def get_invalid_sirets():
    result = DBManager().query(
        f"""SELECT {SiretSearchErrorColumn.SIRET} FROM __SCHEMA_NAME__.{TableName.SIRET_SEARCH_ERROR}
        WHERE fail_count >=5;"""
    )
    return [row[0] for row in result]
