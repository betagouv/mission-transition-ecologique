import json
from etl.transform.daily_web_stat import DailyWebStat
from etl.transform.siret_event import SiretEvent
from datetime import datetime
from dateutil import parser


class PosthogDTO:
    def convert_raw_events_to_posthog_events(self, event):
        linked_event_id = ""
        opportunity_id = ""
        siret = ""
        try:
            parsed_object = json.loads(event[2])
            linked_event_id = parsed_object.get("linkedEventId", "")
            opportunity_id = parsed_object.get("opportunityId", "")
            siret = parsed_object.get("siret", "")
        except Exception as error:
            pass

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

    def convert_raw_response_to_daily_web_stats(self, posthog_response):
        stats = posthog_response["results"]

        daily_web_stats = [
            DailyWebStat(daily_stat[0], daily_stat[1]) for daily_stat in stats
        ]

        return daily_web_stats
