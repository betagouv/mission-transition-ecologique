from etl.transform.dto.baserow.helpers import SECTOR_COLUMN_MAP, COG_MAPPING


def program_from_baserow(program, raw_data):
    """
    Transforms a raw Baserow record into a Program object.
    """
    program.id = raw_data["id"]
    program.slug = raw_data.get("Id fiche dispositif", "").strip()
    program.name = raw_data.get("Titre", "").strip()

    # Contact operator(s)
    program.contact_operator = " | ".join(
        [op.get("value", "").strip() for op in raw_data.get("Opérateur de contact", []) if isinstance(op, dict)]
    )

    # Other operator(s)
    program.other_operators = " | ".join(
        [op.get("value", "").strip() for op in raw_data.get("Autres opérateurs", []) if isinstance(op, dict)]
    )

    # Linked projects
    program.linked_projects = " | ".join(
        [p.get("value", "").strip() for p in raw_data.get("Projets", []) if isinstance(p, dict)]
    )

    # Sector eligibility (reuse shared logic)
    program.sector_eligibility = extract_sector_eligibility(raw_data)

    # Geographic eligibility
    program.geography_eligibility = extract_geography_eligibility(raw_data)

    # Aid type
    program.aid_type = raw_data.get("Nature de l'aide", {}).get("value", "").strip()

    # Themes (Thèmes ciblés)
    program.themes = " | ".join(
        [t.get("value", "").strip() for t in raw_data.get("Thèmes Ciblés", []) if isinstance(t, dict)]
    )

    # Employee filters
    program.min_employee = _safe_int(raw_data.get("minEff"))
    program.max_employee = _safe_int(raw_data.get("maxEff"))

    return program


# --- Helper Functions ---

def _safe_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


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


def extract_geography_eligibility(record):
    # Case 1: National coverage
    couverture = record.get("Couverture géographique")
    if couverture and isinstance(couverture, list) and couverture[0].get("value", "").lower() == "national":
        return "PAYS-99100"

    # Case 2: Regional / departmental coverage
    zones = record.get("Zones géographiques", [])
    if not zones:
        return ""

    mapped = []
    for z in zones:
        value = z.get("value")
        if value in COG_MAPPING:
            mapped.append(COG_MAPPING[value])
        else:
            print(f"[WARN] Unknown geography: {value}")

    return "|".join(mapped)
