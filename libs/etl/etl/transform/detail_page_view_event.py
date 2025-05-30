from etl.transform.establishment import generate_company_id


class DetailPageViewEvent:
    SIRET = "siret"
    HYBRID_COMPANY_ID = "hybrid_company_id"
    CUSTOM_COMPANY_ID = "custom_company_id"
    DATE = "date"
    TYPE = "type"
    TITLE = "title"
    CURRENT_URL = "current_url"
    EVENT_ID = "event_id"
    WEB_USER_ID = "web_user_id"

    def __init__(
        self,
        date,
        siret,
        hybrid_company_id,
        custom_company_id,
        data_type,
        title,
        current_url,
        event_id,
        user_id,
    ):
        self.date = date
        self.siret = siret
        self.hybrid_company_id = hybrid_company_id
        self.custom_company_id = custom_company_id
        self.type = data_type
        self.title = title
        self.current_url = current_url
        self.event_id = event_id
        self.web_user_id = user_id

    def __repr__(self):
        return f"Event : {self.title} renseigné le {self.date})"

    @staticmethod
    def from_posthog_events(posthog_events):
        result = []
        for event in posthog_events:
            custom_id = generate_company_id(event["raw_company"])
            hybrid_id = event["siret"] if event["siret"] else custom_id
            result.append(
                DetailPageViewEvent(
                    event["event_date"],
                    event["siret"],
                    hybrid_id,
                    custom_id,
                    event["object_type"],
                    event["title"],
                    event["url"],
                    event["event_id"],
                    event["person_id"],
                )
            )
        return result
