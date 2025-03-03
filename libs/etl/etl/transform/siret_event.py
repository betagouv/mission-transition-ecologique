class SiretEvent:
    def __init__(self, date, siret):
        self.date = date
        self.siret = siret

    def __repr__(self):
        return f"Siret : {self.siret} renseigné le {self.date})"
