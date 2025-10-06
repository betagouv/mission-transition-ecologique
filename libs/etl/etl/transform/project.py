from etl.transform.dto.baserow.project import project_from_baserow

class Project:
    ID="id"
    SLUG = "slug"
    NAME = "name"
    SECTOR_ELIGIBILITY = "sector_eligibility"
    RELATED_PROGRAMS = "related_programs"
    THEMES = "themes"

    def __init__(self, src, *args):
        self.id= ""
        self.slug = ""
        self.name = ""
        self.sector_eligibility = ""
        self.related_programs = ""
        self.themes = ""

        if src == "baserow":
            project_from_baserow(self, args[0])
        else:
            raise ValueError("Unknown data source")

    def __repr__(self):
        return f"\n{self.slug:<20} | {self.name:<30}"
