from etl.transform.establishment import generate_company_id


class ClickEvent:

    def __init__(
        self,
        date,
        siret,
        hybrid_company_id,
        custom_company_id,
        data_type,
        title,
        current_url,
        link,
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
        self.link = link
        self.event_id = event_id
        self.web_user_id = user_id

    def __repr__(self):
        return f"Event : {self.title} renseigné le {self.date})"


def convert_posthog_events_to_click_events(posthog_events):
    result = []
    for event in posthog_events:
        custom_id = generate_company_id(event["raw_company"])
        hybrid_id = event["siret"] if event["siret"] else custom_id
        result.append(
            ClickEvent(
                event["event_date"],
                event["siret"],
                hybrid_id,
                custom_id,
                event["object_type"],
                event["title"],
                event["url"],
                event["link"],
                event["event_id"],
                event["person_id"],
            )
        )
    return result
