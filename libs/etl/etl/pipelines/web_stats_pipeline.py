from dbManager import DBManager
from posthog.posthogManager import PosthogManager


class WebStatsManager:
    async def get_website_statistics_by_date(self, date):
        query = "SELECT * FROM website_daily_stats WHERE stat_date = $1"
        return await DBManager.query(query, [date])

    async def _get_last_stat_date(self):
        result = await DBManager.query(
            "SELECT stat_date FROM statistics.daily_web_stats ORDER BY stat_date DESC LIMIT 1"
        )
        print(result)
        if result:
            return result[0]["stat_date"]

        # If no data, return 30 days before today
        from datetime import datetime, timedelta

        date = datetime.now() - timedelta(days=30)
        return date.strftime("%Y-%m-%d")  # Format as YYYY-MM-DD

    async def update_website_daily_visit_stats(self):
        last_stat_date = await self._get_last_stat_date()
        start_date = datetime.strptime(last_stat_date, "%Y-%m-%d") + timedelta(days=1)
        end_date = datetime.now()

        start_date_str = start_date.strftime("%Y-%m-%d")
        end_date_str = end_date.strftime("%Y-%m-%d")

        visitors_data = await PosthogManager().get_unique_visitors_by_date_range(
            start_date_str, end_date_str
        )

        if not visitors_data:
            return
        print(visitors_data)
        values = ",".join(
            [f"(${{i * 2 + 1}}, ${{i * 2 + 2}})" for i in range(len(visitors_data))]
        )

        query = f"""
            INSERT INTO statistics.daily_web_stats (stat_date, unique_visitors)
            VALUES {values}
            ON CONFLICT (stat_date)
            DO NOTHING;
        """
        print(query)

        flat_values = [
            item
            for sublist in visitors_data
            for item in [sublist[0].split("T")[0], sublist[1]]
        ]
        print(flat_values)
        return await DBManager.query(query, flat_values)

    async def get_last_siret_event_date(self):
        result = await DBManager.query(
            "SELECT MAX(date) AS last_date FROM statistics.web_registered_siret;"
        )
        print(result)
        return result[0].get("last_date") if result else None

    async def get_new_siret_events(self):
        def format_date(date):
            return date.strftime("%Y-%m-%d %H:%M:%S")

        last_event_date = await self.get_last_siret_event_date()
        start_date = (
            format_date(datetime.strptime(last_event_date, "%Y-%m-%d %H:%M:%S"))
            if last_event_date
            else "1970-01-01 00:00:00"
        )
        end_date = format_date(datetime.now())

        return await PosthogManager().get_siret_events(start_date, end_date)

    async def insert_siret_events(self, events):
        events_to_add = []
        for event in events:
            if event.get("eventDate") and event.get("siret"):
                events_to_add.append(
                    {"date": event["eventDate"], "siret": event["siret"]}
                )

        values = ",".join(
            [f"('{event['date']}', '{event['siret']}')" for event in events_to_add]
        )
        query_text = f"""
            INSERT INTO statistics.web_registered_siret (date, siret)
            VALUES {values}
            ON CONFLICT (date, siret) DO NOTHING;
        """
        try:
            await DBManager.query(query_text)
            print(f"Inserted {len(events)} new SIRET events.")
        except Exception as error:
            print("SIRET Insert Error:", error)

    async def update_web_registered_siret_table(self):
        new_events = await self.get_new_siret_events()
        if new_events:
            await self.insert_siret_events(new_events)
        else:
            print("No new SIRET events found.")
