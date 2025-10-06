from etl.transform.dto.baserow.program import program_from_baserow


class Program:
    ID = "id"
    SLUG = "slug"
    NAME = "name"
    THEMES = "themes"
    AID_TYPE = "aid_type"
    CONTACT_OPERATOR = "contact_operator"
    OTHER_OPERATORS = "other_operators"
    LINKED_PROJECTS = "linked_projects"
    SECTOR_ELIGIBILITY = "sector_eligibility"
    GEOGRAPHY_ELIGIBILITY = "geography_eligibility"
    MIN_EMPLOYEE = "min_employee"
    MAX_EMPLOYEE = "max_employee"

    def __init__(self, src, *args):
        self.id = ""
        self.slug = ""
        self.name = ""
        self.themes = ""
        self.aide_type = ""
        self.contact_operator = ""
        self.other_operators = ""
        self.linked_projects = ""
        self.sector_eligibility = ""
        self.geography_eligibility = ""
        self.min_employee = ""
        self.max_employee = ""

        if src == "baserow":
            program_from_baserow(self, args[0])
        else:
            raise ValueError("Unknown data source")

    def __repr__(self):
        return f"\n{self.slug:<20} | {self.name:<40} | {self.contact_operator}"
