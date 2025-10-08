from etl.transform.dto.baserow.helpers import SECTOR_COLUMN_MAP

def project_from_baserow(project, raw_data):
    project.id = raw_data["id"]
    project.slug = raw_data["Nom"]
    project.name = raw_data["Titre"]
    project.sector_eligibility = extract_sector_eligibility(raw_data)
    project.related_programs = extract_related_programs(raw_data)
    project.themes = extract_themes(raw_data)
    return project

def extract_sector_eligibility(raw_data):
    sectors = [
        code
        for column, code in SECTOR_COLUMN_MAP.items()
        if raw_data.get(column)
    ]
    return "|".join(sectors)

def extract_themes(raw_data):
    primary = [t.get("value") for t in raw_data.get("Thématique principale", [])]
    secondary = [t.get("value") for t in raw_data.get("Thématiques secondaires", [])]
    return " | ".join(primary + secondary)

def extract_related_programs(raw_data):
    dispositifs = raw_data.get("Dispositifs", [])
    programs = [p.get("value", "") for p in dispositifs]
    return " | ".join(programs)
