from etl.transform.dto.brevo import deal_from_brevo


class Deal:
    BREVO_ID = "brevo_id"
    OPPORTUNITY_DATE = "opportunity_date"
    COMPANY_SIRET = "company_siret"
    STATUS = "status"
    OPPORTUNITY_TYPE = "opportunity_type"
    OPPORTUNITY_TITLE = "opportunity_title"
    OPPORTUNITY_OPERATOR = "opportunity_operator"

    def __init__(self, src, *args):
        self.brevo_id = ""
        self.opportunity_date = ""
        self.company_siret = ""
        self.status = ""
        self.operator = ""
        self.opportunity_type = ""
        self.opportunity_title = ""
        self.status_detail_transmise = ""
        self.status_detail_aide_proposee = ""
        self.statut_detail_gagnee = ""
        self.statut_detail_perdue = ""
        self.campaign = ""
        self.partner_id_ce = ""
        self.parter_id_opale = ""
        self.partner_matchquality_opale = ""

        if src == "brevo":
            deal_from_brevo(self, args[0], args[1])
        else:
            raise ValueError("Unknown data source")

    def __repr__(self):
        return f"\n{self.opportunity_date}, {self.opportunity_title:<30}, {self.status}"
