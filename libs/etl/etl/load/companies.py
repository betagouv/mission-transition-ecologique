from etl.tools.db_manager import DBManager
from etl.tools.db_structure import TableName, CompaniesColumn, SiretSearchErrorColumn


def insert_companies(companies):
    if not companies:
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.{TableName.COMPANIES} (
            {CompaniesColumn.SIRET}, {CompaniesColumn.NAF_SECTION}, {CompaniesColumn.NAF_DIVISION}, {CompaniesColumn.NAF_GROUP}, {CompaniesColumn.NAF_CLASS},
            {CompaniesColumn.NAF_CODE}, {CompaniesColumn.CITY_CODE}, {CompaniesColumn.DEPARTMENT}, {CompaniesColumn.REGION}, {CompaniesColumn.WORKFORCE_CATEGORY},
            {CompaniesColumn.WORKFORCE_MIN}, {CompaniesColumn.WORKFORCE_MAX}
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT ({CompaniesColumn.SIRET}) DO NOTHING;
    """
    values = [
        (
            c["siret"],
            c["naf_section"],
            c["naf_division"],
            c["naf_group"],
            c["naf_class"],
            c["naf_code"],
            c["city_code"],
            c["department"],
            c["region"],
            c["workforce_category"],
            c["workforce_min"],
            c["workforce_max"],
        )
        for c in companies
    ]

    try:
        DBManager().query(query, values)
    except Exception as e:
        print(f"Error inserting companies: {e}")


def insert_siren_error(siret):
    query = f"""INSERT INTO __SCHEMA_NAME__.{TableName.SIRET_SEARCH_ERROR} ({SiretSearchErrorColumn.SIRET}, {SiretSearchErrorColumn.FAIL_COUNT})
        VALUES (%s, 1)
        ON CONFLICT ({SiretSearchErrorColumn.SIRET})
        DO UPDATE SET {SiretSearchErrorColumn.FAIL_COUNT} = {TableName.SIRET_SEARCH_ERROR}.{SiretSearchErrorColumn.FAIL_COUNT} + 1;
    """
    try:
        DBManager().query(query, [(siret,)])
    except Exception as e:
        print(f"Error while reporting a siren error in our database: {e}")
