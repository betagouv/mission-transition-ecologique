import json
from etl.transform.daily_web_stat import DailyWebStat
from etl.transform.siret_event import SiretEvent
from datetime import datetime
from dateutil import parser
import hashlib


class PosthogDTO:

    def convert_raw_event_to_posthog_events(self, event):
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

        company_id = self.generate_company_id(company)

        return {
            "event_id": event[0],
            "event_name": event[1],
            "event_date": event[3],
            "distinct_id": event[4],
            "session_id": event[7],
            "person_id": event[9],
            "linked_event_id": linked_event_id,
            "opportunity_id": opportunity_id,
            "siret": siret,
            "object_type": object_type,
            "title": title,
            "url": url,
            "raw_company": company,
            "link": link,
            "company_id": company_id,
        }

    def convert_raw_response_to_siret_events(self, posthog_response):
        events = posthog_response["results"]
        domain_events = []
        for event in events:
            siret = ""
            try:
                parsed_object = json.loads(event[2])
                siret = parsed_object.get("siret", "")
            except Exception as error:
                pass
            date = parser.parse(event[3])
            domain_events.append(SiretEvent(date, siret))
        return domain_events

    def convert_raw_response_to_array(self, posthog_response):
        return posthog_response["results"]

    def generate_company_id(self, raw_company_data):
        if not raw_company_data:
            return None

        parsed_data = json.loads(raw_company_data)
        combined_data = (
            parsed_data.get("codeNAF", "")
            + parsed_data.get("codePostal", "")
            + parsed_data.get("structure_size", "")
        )
        hash_object = hashlib.sha256(combined.encode())
        return hash_object.hexdigest()
