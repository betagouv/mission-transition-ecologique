from datetime import datetime, timedelta
from etl.extract.db_queries import get_last_webstat_date, get_last_siret_event_date
from etl.extract.posthog_extractor import PosthogExtractor
from etl.transform.dto.posthog import PosthogDTO
from etl.load.siret_events import insert_siret_events
from etl.load.daily_web_stats import insert_daily_web_stats
from etl.transform.daily_web_stat import arrays_to_DailyWebStats

class WebStatsPipeline:

    def update_web_registered_siret_table(self):
        new_events = self._get_new_siret_events()
        insert_siret_events(new_events)

    def update_website_daily_visit_stats(self):
        visits_data = self._get_new_daily_web_stats()
        print(visits_data)
        insert_daily_web_stats(visits_data)

    def _get_new_daily_web_stats(self):
        last_stat_date = get_last_webstat_date()
        if not last_stat_date:
            last_stat_date = datetime.now() - timedelta(days=30)

        raw_visits_data = PosthogExtractor().get_unique_visitors_by_date_range(
            last_stat_date + timedelta(days=1),
            datetime.now().replace(hour=23, minute=59, second=59) - timedelta(days=1),
        )
        visits_data = PosthogDTO().convert_raw_response_to_array(raw_visits_data)
        raw_detail_page_data = (
            PosthogExtractor().get_unique_visitors_detail_page_view_by_date_range(
                last_stat_date + timedelta(days=1),
                datetime.now().replace(hour=23, minute=59, second=59)
                - timedelta(days=1),
            )
        )
        detail_page_data = PosthogDTO().convert_raw_response_to_array(
            raw_detail_page_data
        )

        return arrays_to_DailyWebStats(visits_data, detail_page_data)

    def _get_new_siret_events(self):
        start_date = get_last_siret_event_date()
        if not start_date:
            start_date = datetime.now() - timedelta(days=30)

        end_date = datetime.now()

        raw_events = PosthogExtractor().get_siret_events(start_date, end_date)
        return PosthogDTO().convert_raw_response_to_siret_events(raw_events)
