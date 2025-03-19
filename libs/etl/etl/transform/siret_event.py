class SiretEvent:
    def __init__(self, date, siret):
        self.date = date
        self.siret = siret

    def __repr__(self):
        return f"Siret : {self.siret} renseigné le {self.date})"


def convert_posthog_events_to_siret_events(posthog_events):
    return [SiretEvent(event["event_date"], event["siret"]) for event in posthog_events]
