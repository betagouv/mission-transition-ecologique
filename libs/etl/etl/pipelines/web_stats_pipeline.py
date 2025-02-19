from datetime import datetime, timedelta
from etl.extract.db_queries import get_last_webstat_date, get_last_siret_event_date
from etl.extract.posthog_extractor import PosthogManager
from etl.transform.dto.posthog import convert_raw_response_to_siret_events


class WebStatsPipeline:

    def _get_last_stat_date(self):
        ### Return the last stat date of a default date in YYYY-MM-DD STRING format ###
        query_result = get_last_webstat_date()
        if query_result:
            return query_result

        date = datetime.now() - timedelta(days=30)
        return date.strftime("%Y-%m-%d")

    def update_website_daily_visit_stats(self):
        last_stat_date = self._get_last_stat_date()
        start_date = datetime.strptime(last_stat_date, "%Y-%m-%d") + timedelta(days=1)
        end_date = datetime.now() - timedelta(days=1)

        # convert dates to the expected posthog API format.
        # TODO do it IN posthog manager.
        start_date_str = start_date.strftime("%Y-%m-%d")
        end_date_str = end_date.strftime("%Y-%m-%d")

        visitors_data = PosthogManager().get_unique_visitors_by_date_range(
            start_date_str, end_date_str
        )

        if not visitors_data:
            return

        values = ",".join(
            [f"(${{i * 2 + 1}}, ${{i * 2 + 2}})" for i in range(len(visitors_data))]
        )

        query = f"""
            INSERT INTO __SCHEMA_NAME__.daily_web_stats (stat_date, unique_visitors)
            VALUES {values}
            ON CONFLICT (stat_date)
            DO NOTHING;
        """

        flat_values = [
            item
            for sublist in visitors_data
            for item in [sublist[0].split("T")[0], sublist[1]]
        ]
        print(query)
        print(flat_values)
        # TODO : uncomment + move into load with the code above.
        # DBManager().query(query, flat_values)
        return true

    def get_new_siret_events(self):
        last_event_date = get_last_siret_event_date()
        start_date = (
            last_event_date if last_event_date else datetime.now() - timedelta(days=30)
        )
        end_date = datetime.now()

        raw_events = PosthogManager().get_siret_events(start_date, end_date)
        return convert_raw_response_to_siret_events(raw_events)

    def insert_siret_events(self, events):
        events_to_add = []
        print(events)
        for event in events:
            print(event)
            if event.get("event_date") and event.get("siret"):
                events_to_add.append(
                    {"date": event["event_date"], "siret": event["siret"]}
                )

        values = ",".join(
            [f"('{event['date']}', '{event['siret']}')" for event in events_to_add]
        )
        query_text = f"""
            INSERT INTO __SCHEMA_NAME__.web_registered_siret (date, siret)
            VALUES {values}
            ON CONFLICT (date, siret) DO NOTHING;
        """
        try:
            print(query_text)
            # TODO : uncomment + move into load with the code above.
            # DBManager().query(query_text)
            print(f"Inserted {len(events)} new SIRET events.")
        except Exception as error:
            print("SIRET Insert Error:", error)

    def update_web_registered_siret_table(self):
        new_events = self.get_new_siret_events()
        if new_events:
            self.insert_siret_events(new_events)
        else:
            print("No new SIRET events found.")
