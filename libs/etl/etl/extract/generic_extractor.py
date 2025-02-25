import os
import json
from etl.extract.brevo_extractor import BrevoExtractor
from etl.extract.posthog_extractor import PosthogManager


class GenericExtractor:
    def __init__(self, cache_dir="cache"):
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)
        self.brevoExtractor = BrevoExtractor()

    def _get_cache_path(self, data_type):
        """Returns the cache file path for the given data type"""
        return os.path.join(self.cache_dir, f"{data_type}.json")

    def _save_to_cache(self, data, data_type):
        """Saves data to a JSON file"""
        with open(self._get_cache_path(data_type), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

    def _load_from_cache(self, data_type):
        """Loads data from a JSON file if it exists"""
        cache_path = self._get_cache_path(data_type)
        if os.path.exists(cache_path):
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return None

    def _get_data(self, data_name, data_providing_method, force_refresh):
        """Fetches contacts from the loaders or loads from cache"""
        if not force_refresh:
            cached_data = self._load_from_cache(data_name)
            if cached_data:
                return cached_data

        # If no cache or force refresh, call the original method
        contacts = data_providing_method()
        self._save_to_cache(contacts, data_name)
        return contacts

    def get_contacts(self, force_refresh=False):
        return self._get_data(
            "contacts", self.brevoExtractor.get_contacts, force_refresh
        )

    def get_deals(self, force_refresh=False):
        return self._get_data("deals", self.brevoExtractor.get_deals, force_refresh)

    def get_form_events(self, force_refresh=False):
        return self._get_data(
            "form_events", PosthogManager().get_form_events, force_refresh
        )

    def get_siret_events(self, start_date, end_date, force_refresh=False):
        return self._get_data(
            "siret_events",
            lambda: PosthogManager().get_siret_events(start_date, end_date),
            force_refresh,
        )

    def get_unique_visitors_by_date_range(
        self, start_date, end_date, force_refresh=False
    ):
        return self._get_data(
            "unique_visitors_by_date_range",
            lambda: PosthogManager().get_unique_visitors_by_date_range(
                start_date, end_date
            ),
            force_refresh,
        )
