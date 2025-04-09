import json
from pathlib import Path
import hashlib


communes_json_path = Path(__file__).parent.parent / "static" / "communes.json"
with communes_json_path.open("r", encoding="utf-8") as file:
    communes = json.load(file)

naf_mapping_json_path = Path(__file__).parent.parent / "static" / "nafMapping.json"
with naf_mapping_json_path.open("r", encoding="utf-8") as file:
    naf_mapping = json.load(file)

def siren_establishment_to_db_establishment(siren_data):
    """Extracts relevant establishment details from API response."""
    raw_establishment = siren_data["etablissement"]
    db_establishement = {
        "siren": raw_establishment["siren"],
        "nic": raw_establishment["nic"],
        "siret": raw_establishment["siret"],
        "denomination": raw_establishment["uniteLegale"]["denominationUniteLegale"],
        "creation_date": raw_establishment["uniteLegale"]["dateCreationUniteLegale"],
        "naf_code": raw_establishment["uniteLegale"]["activitePrincipaleUniteLegale"],
        "legal_category": raw_establishment["uniteLegale"][
            "categorieJuridiqueUniteLegale"
        ],
        "address": {
            "zipCode": raw_establishment["adresseEtablissement"][
                "codePostalEtablissement"
            ],
            "cityLabel": raw_establishment["adresseEtablissement"][
                "libelleCommuneEtablissement"
            ],
            "cityCode": raw_establishment["adresseEtablissement"][
                "codeCommuneEtablissement"
            ],
        },
        "workforce_range": raw_establishment["trancheEffectifsEtablissement"],
    }
    db_establishement["workforce_category"] = (
        db_establishement["workforce_range"]
        if db_establishement["workforce_range"] != "NN"
        else "null"
    )

    if db_establishement["legal_category"] == "1000":
        db_establishement["workforce_min"] = 1
        db_establishement["workforce_max"] = 1
        db_establishement["workforce_category"] = "01a"
    else:
        db_establishement["workforce_min"] = get_workforce_range(
            db_establishement["workforce_category"]
        )[0]
        db_establishement["workforce_max"] = get_workforce_range(
            db_establishement["workforce_category"]
        )[1]

    db_establishement["city_code"] = db_establishement["address"]["cityCode"]

    db_establishement["department"] = get_department(
        db_establishement["address"]["cityCode"],
        db_establishement["address"]["zipCode"],
    )
    db_establishement["region"] = get_region(
        db_establishement["address"]["cityCode"],
        db_establishement["address"]["zipCode"],
    )

    naf = get_naf_details(db_establishement["naf_code"])

    db_establishement["naf_section"] = naf["section"]
    db_establishement["naf_division"] = naf["division"]
    db_establishement["naf_group"] = naf["groupe"]
    db_establishement["naf_class"] = naf["classe"]

    return db_establishement


def get_workforce_range(tranche):
    salary_ranges = {
        "00": [0, 0],
        "01": [1, 2],
        "02": [3, 5],
        "03": [6, 9],
        "11": [10, 19],
        "12": [20, 49],
        "21": [50, 99],
        "22": [100, 199],
        "31": [200, 249],
        "32": [250, 499],
        "41": [500, 999],
        "42": [1000, 1999],
        "51": [2000, 4999],
        "52": [5000, 99999],
        "53": [10000, 1000000],
    }
    return salary_ranges.get(tranche, [None, None])


def get_department(city_code, zip_code):
    commune = next(
        (
            c
            for c in communes
            if c["code"] == city_code or zip_code in c["codesPostaux"]
        ),
        None,
    )
    return commune["departement"]["code"] if commune else "999"


def get_region(city_code, zip_code):
    commune = next(
        (
            c
            for c in communes
            if c["code"] == city_code or zip_code in c["codesPostaux"]
        ),
        None,
    )
    return commune["region"]["nom"] if commune else "999"


def get_naf_details(naf_code):
    naf_data = next((data for data in naf_mapping if data["NIV5"] == naf_code), None)
    return {
        "naf": naf_data["NIV5"] if naf_data else "null",
        "section": naf_data["NIV1"] if naf_data else "null",
        "division": naf_data["NIV2"] if naf_data else "null",
        "groupe": naf_data["NIV3"] if naf_data else "null",
        "classe": naf_data["NIV4"] if naf_data else "null",
    }


def generate_company_id(raw_company_data):
    if not raw_company_data:
        return None

    parsed_data = json.loads(raw_company_data)
    combined_data = (
        parsed_data.get("codeNAF", "")
        + parsed_data.get("codePostal", "")
        + parsed_data.get("structure_size", "")
    )
    hash_object = hashlib.sha256(combined_data.encode())
    return hash_object.hexdigest()
