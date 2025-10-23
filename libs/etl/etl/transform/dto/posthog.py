import json
from etl.transform.daily_web_stat import DailyWebStat
from etl.transform.siret_event import SiretEvent
from datetime import datetime
from dateutil import parser
import hashlib
from urllib.parse import urlparse


class PosthogDTO:

    def convert_raw_response_to_posthog_events(self, posthog_response):
        events = posthog_response["results"]
        return [self.convert_raw_event_to_posthog_event(event) for event in events]

    def convert_raw_event_to_posthog_event(self, event):
        linked_event_id = ""
        opportunity_id = ""
        siret = ""
        object_type = ""
        title = ""
        url = ""
        company = ""
        link = ""
        try:
            parsed_object = json.loads(event[2])
            linked_event_id = parsed_object.get("linkedEventId", "")
            opportunity_id = parsed_object.get("opportunityId", "")
            siret = parsed_object.get("siret", "")
            object_type = parsed_object.get("type", "")
            title = parsed_object.get("title", "")
            url = parsed_object.get("url", "")
            company = parsed_object.get("company", "")
            link = parsed_object.get("link", "")
        except Exception as error:
            pass

        if not siret:
            siret = self.get_siret_from_company(company)

        if not title:
            title = self.get_title_from_url(url)

        return {
            "event_id": event[0],
            "event_name": event[1],
            "event_date": parser.parse(event[3]),
            "distinct_id": event[4],
            "session_id": event[5],
            "person_id": event[6],
            "linked_event_id": linked_event_id,
            "opportunity_id": opportunity_id,
            "siret": siret,
            "object_type": object_type,
            "title": title,
            "url": url,
            "raw_company": company,
            "link": link,
        }

    def convert_raw_response_to_array(self, posthog_response):
        return posthog_response["results"]

    def get_siret_from_company(self, raw_company_data):
        if not raw_company_data:
            return ""
        try:
            parsed_data = json.loads(raw_company_data)
            return parsed_data.get("siret", "")
        except:
            return ""

    def get_title_from_url(self, url):
        if not url:
            return ""

        parsed_url = urlparse(url)
        path = parsed_url.path.rstrip("/")
        return path.split("/")[-1]
