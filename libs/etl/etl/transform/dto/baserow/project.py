from etl.transform.dto.baserow.helpers import SECTOR_COLUMN_MAP

def project_from_baserow(project, raw_data):
    print(raw_data)
    project.id = raw_data["id"]
    project.slug = raw_data["Nom"]
    project.name = raw_data["Titre"]
    project.sector_eligibility = extract_sector_eligibility(raw_data)
    project.related_programs = " | ".join(
                  [p.get("value", "").strip() for p in raw_data.get("Dispositifs", []) if isinstance(p, dict)]
              )
    project.themes = extract_themes(raw_data)
    return project

def _is_truthy(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        v = value.strip().lower()
        return v in {"true", "1", "yes", "y", "oui", "o"}
    return False

def extract_sector_eligibility(record):
    letters = []
    for col_name, letter in SECTOR_COLUMN_MAP.items():
        if _is_truthy(record.get(col_name)):
            letters.append(letter)
    return "|".join(letters)

def extract_themes(record):
    def names(field):
        items = record.get(field) or []
        return [
            (item.get("value") or item.get("name") or "").strip()
            for item in items
            if isinstance(item, dict)
        ]

    return " | ".join([t for t in (names("Thématique principale") + names("Thématiques secondaires")) if t])

