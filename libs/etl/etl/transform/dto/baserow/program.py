from etl.transform.dto.baserow.helpers import SECTOR_COLUMN_MAP, COG_MAPPING


def program_from_baserow(program, raw_data):
    program.id = raw_data["id"]
    program.slug = raw_data.get("Id fiche dispositif", "")
    program.name = raw_data.get("Titre", "")
    program.contact_operator = extract_contact_operator(raw_data)
    program.other_operators = extract_other_operators(raw_data)
    program.linked_projects = extract_linked_projects(raw_data)
    program.sector_eligibility = extract_sector_eligibility(raw_data)
    program.geography_eligibility = extract_geography_eligibility(raw_data)
    program.aid_type = raw_data.get("Nature de l'aide", {}).get("value", "")
    program.themes = extract_themes(raw_data)
    program.min_employee = safe_int(raw_data.get("minEff"))
    program.max_employee = safe_int(raw_data.get("maxEff"))
    return program

def extract_contact_operator(raw_data):
    return " | ".join([op.get("value", "") for op in raw_data.get("Opérateur de contact", [])])

def extract_other_operators(raw_data):
    return " | ".join([op.get("value", "") for op in raw_data.get("Autres opérateurs", [])])

def extract_linked_projects(raw_data):
    return " | ".join([p.get("value", "") for p in raw_data.get("Projets", [])])

def extract_sector_eligibility(raw_data):
    sectors = [code for column, code in SECTOR_COLUMN_MAP.items() if raw_data.get(column)]
    return "|".join(sectors)

def extract_themes(raw_data):
    themes = [t.get("value", "") for t in raw_data.get("Thèmes Ciblés", [])]
    return " | ".join(themes)

def extract_geography_eligibility(raw_data):
    couverture = raw_data.get("Couverture géographique")
    if couverture and couverture[0].get("value", "").lower() == "national":
        return "PAYS-99100"

    zones = raw_data.get("Zones géographiques", [])
    mapped = [COG_MAPPING[zone.get("value")] for zone in zones if zone.get("value") in COG_MAPPING]
    return "|".join(mapped)

def safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None
