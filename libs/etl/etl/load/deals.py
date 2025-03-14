from etl.tools.db_manager import DBManager


def update_deals(deals):
    if not len(deals):
        return

    query = f"""
      INSERT INTO __SCHEMA_NAME__.opportunities (
          brevo_id, opportunity_date, company_siret, status, opportunity_type, opportunity_title, opportunity_operator
      ) VALUES (%s, %s, %s, %s, %s, %s, %s)
      ON CONFLICT (brevo_id)
      DO UPDATE SET
          company_siret = CASE WHEN EXCLUDED.company_siret <> '' THEN EXCLUDED.company_siret ELSE opportunities.company_siret END,
          status = CASE WHEN EXCLUDED.status <> '' THEN EXCLUDED.status ELSE opportunities.status END,
          opportunity_type = CASE WHEN EXCLUDED.opportunity_type <> '' THEN EXCLUDED.opportunity_type ELSE opportunities.opportunity_type END,
          opportunity_title = CASE WHEN EXCLUDED.opportunity_title <> '' THEN EXCLUDED.opportunity_title ELSE opportunities.opportunity_title END,
          opportunity_operator = CASE WHEN EXCLUDED.opportunity_operator <> '' THEN EXCLUDED.opportunity_operator ELSE opportunities.opportunity_operator END;
    """

    values = [
        (
            deal.brevo_id,
            deal.opportunity_date,
            deal.company_siret,
            deal.status,
            deal.opportunity_type,
            deal.opportunity_title,
            deal.operator,
        )
        for deal in deals
    ]

    try:
        DBManager().query(query, values)
    except Exception as error:
        print("Error during the opportunity update query:", error)
