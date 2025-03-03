from etl.tools.db_manager import DBManager


def insert_companies(companies):
    if not companies:
        return

    query = """
        INSERT INTO __SCHEMA_NAME__.companies (
            siret, naf_section, naf_division, naf_group, naf_class,
            naf_code, city_code, department, region, workforce_category,
            workforce_min, workforce_max
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (siret) DO NOTHING;
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
    query = """INSERT INTO __SCHEMA_NAME__.siret_search_error (siret, fail_count)
        VALUES (%s, 1)
        ON CONFLICT (siret)
        DO UPDATE SET fail_count = siret_search_error.fail_count + 1;
        """
    try:
        DBManager().query(query, [(siret,)])
    except Exception as e:
        print(f"Error while reporting a siren error in our database: {e}")
