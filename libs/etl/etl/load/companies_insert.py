from etl.tools.db_manager import DBManager


def batch_insert_companies(companies):
    if not companies:
        return

    values = ", ".join(
        [
            f"('{c['siret']}', '{c['naf_section']}', '{c['naf_division']}', '{c['naf_group']}', "
            f"'{c['naf_class']}', '{c['naf_code']}', '{c['city_code']}', '{c['department']}', "
            f"{escape_string(c['region'])}, {c['workforce_category']}, {c['workforce_min']}, {c['workforce_max']})"
            for c in companies
        ]
    )

    query = f"""
        INSERT INTO __SCHEMA_NAME__.companies (
            siret, naf_section, naf_division, naf_group, naf_class,
            naf_code, city_code, department, region, workforce_category,
            workforce_min, workforce_max
        ) VALUES {values}
        ON CONFLICT (siret) DO NOTHING;
    """

    try:
        # TODO uncomment
        print(query)
        # DBManager().query(query)
        print(f"Inserted {len(companies)} new companies.")
    except Exception as e:
        print(f"Error inserting companies: {e}")


def escape_string(value):
    return "NULL" if value is None else f"'{value.replace("'", "''")}'"
