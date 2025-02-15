def _convert_raw_events_to_posthog_events(self, event):
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
