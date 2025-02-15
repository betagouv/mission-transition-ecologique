from brevo.brevoManager import BrevoManager
from dbManager import DBManager


class OpportunityManager:
    async def update_opportunity_table(self):
        deals = await BrevoManager().get_deals()
        db_deals = await DBManager.query(
            """
            SELECT brevo_id FROM statistics.opportunities
        """
        )
        brevo_id_set = set(item["brevo_id"] for item in db_deals)

        new_deals = [deal for deal in deals if deal["dealId"] not in brevo_id_set]

        if not new_deals:
            print("No new opportunities to insert.")
            return

        batch_size = 5
        for i in range(0, len(new_deals), batch_size):
            batch = new_deals[i : i + batch_size]
            try:
                values = ",".join(
                    f"(${{i * 6 + 1}}, ${{i * 6 + 2}}, ${{i * 6 + 3}}, ${{i * 6 + 4}}, ${{i * 6 + 5}}, ${{i * 6 + 6}})"
                    for i, _ in enumerate(batch)
                )

                query = f"""
                    INSERT INTO statistics.opportunities (
                        brevo_id, opportunity_date, company_siret, status, opportunity_type, opportunity_title
                    ) VALUES {values}
                    ON CONFLICT (brevo_id) DO NOTHING;
                """

                flat_values = [
                    item["dealId"],
                    self.format_date_without_timezone(item["creationDate"]),
                    item["siret"].replace(" ", ""),
                    item["status"],
                    self.map_opportunity_type(item["opportunityType"]),
                    item["name"],
                ]
                await DBManager.query(query, flat_values)
                print(f"Successfully processed batch {i // batch_size + 1}")
            except Exception as error:
                print(f"Failed to process batch {i // batch_size + 1}:", error)
            await asyncio.sleep(0.5)

        print(f"Inserted {len(new_deals)} new opportunities.")

    def format_date_without_timezone(self, timestamp):
        return timestamp[:19].replace("T", " ")

    def map_opportunity_type(self, type):
        type_mapping = {
            "program": "program",
            "project": "projet",
            "customProject": "projet personnalisé",
        }
        return type_mapping.get(type, type)
