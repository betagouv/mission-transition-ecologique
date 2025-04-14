class SiretEvent:
    DATE = "date"
    SIRET = "siret"

    def __init__(self, date, siret):
        self.date = date
        self.siret = siret

    def __repr__(self):
        return f"Siret : {self.siret} renseigné le {self.date}"

    @staticmethod
    def from_posthog_events(posthog_events):
        return [
            SiretEvent(event["event_date"], event["siret"]) for event in posthog_events
        ]
