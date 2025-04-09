from etl.transform.deals import Deal
from etl.tools.db_manager import DBManager


def update_deals(deals: list[Deal]):
    if not len(deals):
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.opportunities (
            {Deal.BREVO_ID},
            {Deal.OPPORTUNITY_DATE},
            {Deal.COMPANY_SIRET},
            {Deal.STATUS},
            {Deal.OPPORTUNITY_TYPE},
            {Deal.OPPORTUNITY_TITLE},
            {Deal.OPPORTUNITY_OPERATOR}
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT ({Deal.BREVO_ID})
        DO UPDATE SET
            {Deal.COMPANY_SIRET} = CASE WHEN EXCLUDED.{Deal.COMPANY_SIRET} <> '' THEN EXCLUDED.{Deal.COMPANY_SIRET} ELSE opportunities.{Deal.COMPANY_SIRET} END,
            {Deal.STATUS} = CASE WHEN EXCLUDED.{Deal.STATUS} <> '' THEN EXCLUDED.{Deal.STATUS} ELSE opportunities.{Deal.STATUS} END,
            {Deal.OPPORTUNITY_TYPE} = CASE WHEN EXCLUDED.{Deal.OPPORTUNITY_TYPE} <> '' THEN EXCLUDED.{Deal.OPPORTUNITY_TYPE} ELSE opportunities.{Deal.OPPORTUNITY_TYPE} END,
            {Deal.OPPORTUNITY_TITLE} = CASE WHEN EXCLUDED.{Deal.OPPORTUNITY_TITLE} <> '' THEN EXCLUDED.{Deal.OPPORTUNITY_TITLE} ELSE opportunities.{Deal.OPPORTUNITY_TITLE} END,
            {Deal.OPPORTUNITY_OPERATOR} = CASE WHEN EXCLUDED.{Deal.OPPORTUNITY_OPERATOR} <> '' THEN EXCLUDED.{Deal.OPPORTUNITY_OPERATOR} ELSE opportunities.{Deal.OPPORTUNITY_OPERATOR} END;
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
