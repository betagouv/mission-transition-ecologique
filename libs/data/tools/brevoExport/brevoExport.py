#!/usr/bin/env python3
import json
import csv
import os
import re
from datetime import datetime
import pytz
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

# parameters
BREVO_API_KEY_FILE_PATH = "../../../../apps/backend/.env"
REFRESH_CONTACTS = True  # True = use brevo API, False = use local file
REFRESH_DEALS = True  # True = use brevo API, False = use local file
EXPORT_TO_JSON = True
EXPORT_TO_CSV = True

# cosntants
OBJECTIFS = [
    "mon impact environnemental",
    "ma performance \u00e9nerg\u00e9tique",
    "diminuer ma consommation d'eau",
    "r\u00e9nover mon b\u00e2timent",
    "la mobilit\u00e9 durable",
    "la gestion des d\u00e9chets",
    "l'\u00e9coconception",
    "former ou recruter",
]
REGIONS = {
    "Auvergne-Rhône-Alpes": [
        "01",
        "03",
        "07",
        "15",
        "26",
        "38",
        "42",
        "43",
        "63",
        "69",
        "73",
        "74",
    ],
    "Bourgogne-Franche-Comté": ["21", "25", "39", "58", "70", "71", "89", "90"],
    "Bretagne": ["35", "22", "56", "29"],
    "Centre-Val de Loire": ["18", "28", "36", "37", "41", "45"],
    "Corse": ["2A", "2B"],
    "Grand Est": ["08", "10", "51", "52", "54", "55", "57", "67", "68", "88"],
    "Guadeloupe": ["971"],
    "Guyane": ["973"],
    "Hauts-de-France": ["02", "59", "60", "62", "80"],
    "Île-de-France": ["75", "77", "78", "91", "92", "93", "94", "95"],
    "La Réunion": ["974"],
    "Martinique": ["972"],
    "Normandie": ["14", "27", "50", "61", "76"],
    "Nouvelle-Aquitaine": [
        "16",
        "17",
        "19",
        "23",
        "24",
        "33",
        "40",
        "47",
        "64",
        "79",
        "86",
        "87",
    ],
    "Occitanie": [
        "09",
        "11",
        "12",
        "30",
        "31",
        "32",
        "34",
        "46",
        "48",
        "65",
        "66",
        "81",
        "82",
    ],
    "Pays de la Loire": ["44", "49", "53", "72", "85"],
    "Provence-Alpes-Côte d'Azur": ["04", "05", "06", "13", "83", "84"],
}


def read_brevo_api_key(filepath: str) -> str:
    """Reads Brevo API key from the specified file."""

    if not os.path.isfile(filepath):
        print(f"Error: env file '{filepath}' does not exist.")
    with open(filepath, "r") as file:
        lines = file.readlines()
    for line in lines:
        if line.startswith("BREVO_API_TOKEN="):
            token = line.split("=")[1].strip()
            return token

    print("Error: BREVO_API_TOKEN not found in the environment file.")
    return ""


def initialize_brevo_configuration() -> sib_api_v3_sdk.Configuration:
    """Initializes Brevo API configuration."""
    BREVO_API_KEY = read_brevo_api_key(BREVO_API_KEY_FILE_PATH)
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = BREVO_API_KEY
    return configuration


def write_json(data, filename):
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)


def read_json(filename):
    with open(filename, "r") as file:
        data = json.load(file)
        return data


def get_brevo_contacts(api_config, origin):
    """Retrieves contacts from Brevo API or from a JSON file."""
    contact_list = []
    if origin:
        api_instance = sib_api_v3_sdk.ContactsApi(sib_api_v3_sdk.ApiClient(api_config))
        limit = 1000  # max value to reduce the number of queries (20max per sec)
        offset = 0
        try:
            api_response = api_instance.get_contacts(limit=limit, offset=offset)
            contact_list.extend(api_response.contacts)
            while offset < api_response.count:
                offset += limit
                api_response = api_instance.get_contacts(limit=limit, offset=offset)
                contact_list.extend(api_response.contacts)
            write_json(contact_list, "brevoContacts.json")
            print(f"Importé {len(contact_list)} Brevo contacts")
        except ApiException as e:
            print("Exception when calling ContactsApi->get_contacts: %s\n" % e)
    else:
        contact_list = read_json("brevoContacts.json")
        print(f"Read {len(contact_list)} Brevo contacts")

    return contact_list


def serialize_deal(deal):
    if isinstance(deal, dict):
        return deal
    elif hasattr(deal, "__dict__"):
        return deal.__dict__
    else:
        return str(deal)


def get_brevo_deals(api_config, origin):
    """Retrieves Brevo deals from Brevo API or from a JSON file."""
    deal_list = []
    if origin:
        api_instance = sib_api_v3_sdk.DealsApi(sib_api_v3_sdk.ApiClient(api_config))
        limit = 100000  # Allowed value that largely exceed the nomber of deals we have
        offset = 0
        try:
            api_response = api_instance.crm_deals_get(limit=limit, offset=offset)
            deal_list.extend(api_response.items)
            deal_list = [serialize_deal(deal) for deal in deal_list]
            write_json(deal_list, "brevoDeals.json")
            print(f"Importé {len(deal_list)} Brevo deals")
        except ApiException as e:
            print("Exception when calling DealApi->crm_deals_get: %s\n" % e)
    else:
        deal_list = read_json("brevoDeals.json")
        print(f"Read {len(deal_list)} Brevo deals")
    return deal_list


def flatten_json(json_obj, obj_name):
    flattened = {}
    attributes = json_obj.pop(obj_name, {})
    for key, value in attributes.items():
        flattened[key] = value
    flattened.update(json_obj)
    return flattened


def filter_deals(json_deal_list):
    "Keep the deals only if they are on the production pipeline"
    filtered_deals = []
    for deal in json_deal_list:
        if deal["pipeline"] == "65719d9023acb4f05e56e7eb":
            filtered_deals.append(deal)
    return filtered_deals


def merge_contact_in_deal(json_deal_list, json_contact_list):
    contact_dict = {contact["id"]: contact for contact in json_contact_list}

    for deal in json_deal_list:
        linked_contacts_ids = deal.get("_linked_contacts_ids", [])
        if len(linked_contacts_ids) == 1:
            contact_id = linked_contacts_ids[0]
            if contact_id in contact_dict:
                contact_entry = contact_dict[contact_id]
                prefixed_contact_entry = {
                    "Contact_" + key: value for key, value in contact_entry.items()
                }
                deal.update(prefixed_contact_entry)
            else:
                print(f"Deal {deal.get('_id')} : Contact Non found")
        else:
            print(f"Deal {deal.get('_id')} : 0 ou plus d'un contact associé au deal!")


def improve_merge_data(data):
    for deal in data:
        # basic column renaming
        deal["dealId"] = deal.pop("_id")
        deal["nom du dispositif"] = deal.pop("deal_name")
        if "oprateur_de_contact" in deal:
            deal["opérateur_de_contact"] = deal.pop("oprateur_de_contact")
        else:
            print(f"Deal {deal.get('dealId')} : PAs d'operateur de contact")

        # simple reformatting
        deal["créé le"] = format_date(deal["created_at"])
        deal["lien du dispositif"] = (
            "https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise/"
            + deal["nom du dispositif"]
        )
        deal["Etape de l'opportunité"] = format_deal_stage(deal["deal_stage"])

        # complex data parsing
        deal["Contact_STRUCTURE_TAILLE"] = define_structure_size(deal)
        if "autres_donnes" in deal and deal["autres_donnes"] != "[]":
            deal["Code Postal"] = get_code_postal(deal["autres_donnes"])
            deal["Région"] = get_region(deal["autres_donnes"], deal["Code Postal"])
            create_objectifs_columns(deal)
            deal["Code NAF"] = get_NAF(deal["autres_donnes"])


def format_deal_stage(deal_stage):
    if deal_stage == "f0f8a5c8-023b-46cc-9826-1c5da7abc1f0":
        return "Nouvelle"
    elif deal_stage == "659d15cff01695.94588187":
        return "Transmise"
    elif deal_stage == 'c1d2ed92-8bc3-492d-a3ec-0284e214baa0':
        return "Perdue"
    elif deal_stage == '659d15cff06be7.98275409':
        return "Aide Proposée"
    elif deal_stage == "1e33531f-0eef-40ea-b97c-35aadc929446":
        return "Gagnée"
    else:
        print("unexpected deal stage", deal_stage)
        return "Inconnue"


def define_structure_size(deal):
    """Get the structure size using all possible encoding of it."""
    size = ""
    if "Contact_TAILLE" in deal and deal["Contact_TAILLE"] != "":
        workforce_to_type = {"1": "TPE", "2": "PME", "3": "PME", "4": "ETI,GE", "5": "EI"}
        size = workforce_to_type[deal["Contact_TAILLE"]]
    elif "autres_donnes" in deal and deal["autres_donnes"] != "":
        pattern = r"/ structure_sizes: (.+?) /"
        match = re.search(pattern, deal["autres_donnes"])
        if match:
            size = match.group(1)
        else:
            pattern = r'"structure_size":"([^"]+)"'
            match = re.search(pattern, deal["autres_donnes"])
            if match:
                size = match.group(1)
    elif "Contact_STRUCTURE_SIZE" in deal:
        size = deal["Contact_STRUCTURE_SIZE"]
    return size


def format_date(date):
    dt_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
    utc_timezone = pytz.utc
    paris_timezone = pytz.timezone("Europe/Paris")
    dt_obj_paris = dt_obj.astimezone(paris_timezone)
    return dt_obj_paris.strftime("%Y-%m-%d à %H-%M")


def get_region_from_postal_code(postal_code):
    prefix = postal_code[:2]
    for region, prefixes in REGIONS.items():
        if prefix in prefixes:
            return region
    prefix = postal_code[:3]
    for region, prefixes in REGIONS.items():
        if prefix in prefixes:
            return region
        return None


def get_region(s, codePostal):
    """Get region using all possible data pattern.
    Fallback on using the postal code if we have it."""
    region_pattern = r'(?i)r[eé]gion\s*:\s*"?([^"/]+)"?'
    match = re.search(region_pattern, s)
    if match:
        region = match.group(1)
        return region

    region_pattern = r'"r[eé]gion":"([^"]+)"'
    match = re.search(region_pattern, s)
    if match:
        region = match.group(1)
        return region

    if get_region_from_postal_code(codePostal):
        return get_region_from_postal_code(codePostal)
    return ""


def get_NAF(s):
    regex_pattern = r"\b\d{2}\.\d{2}[A-Z]\b"
    matches = re.findall(regex_pattern, s)
    if len(matches) == 0:
        return ""
    if len(matches) > 1:
        print("warning, more than 1 NAF code found !")
    return matches[0]


def flatten_list_of_dicts(data):
    """
    Flatten a list of dictionaries into a single dictionary.
    """
    flattened_dict = {}
    for d in data:
        if d:
            flattened_dict.update(d)
    return flattened_dict


def create_objectifs_columns(deal):
    other_data = deal["autres_donnes"]
    # option 1 : the format I get is the most recent json
    try:
        other_data_json = json.loads(other_data)
        other_data_dict = flatten_list_of_dicts(other_data_json)
        if "priority_objective" in other_data_dict:
            priority_objective = other_data_dict["priority_objective"]
            for objectif in OBJECTIFS:
                if priority_objective == objectif:
                    deal["Objectif: " + objectif] = "oui"
                else:
                    deal["Objectif: " + objectif] = "non"
            return
        if "energy_reduction_objective" in other_data_dict:
            if other_data_dict["recently_audited"] == "non":
                deal["Objectif: mon impact environnemental"] = "oui"
            else:
                deal["Objectif: mon impact environnemental"] = "non"

            if other_data_dict["wastes_materials_objective"] == "non":
                deal["Objectif: l'écoconception"] = "non"
            else:
                deal["Objectif: l'écoconception"] = "oui"

            if (
                other_data_dict["wastes_management_objective"] == "non"
                or other_data_dict["wastes_management_objective"] == "non-max"
            ):
                deal["Objectif: la gestion des déchets"] = "oui"
            else:
                deal["Objectif: la gestion des déchets"] = "non"

            if other_data_dict["water_reduction_objective"] == "non":
                deal["Objectif: diminuer ma consommation d'eau"] = "non"
            else:
                deal["Objectif: diminuer ma consommation d'eau"] = "oui"

            if (
                other_data_dict["sustainable_mobility_objective"] == "non"
                or other_data_dict["sustainable_mobility_objective"] == "non-max"
            ):
                deal["Objectif: la mobilité durable"] = "oui"
            else:
                deal["Objectif: la mobilité durable"] = "non"

            deal["Objectif: rénover mon bâtiment"] = "Non spécifié"
            deal["Objectif: former ou recruter"] = "Non spécifié"

            if other_data_dict["energy_reduction_objective"] == "non":
                deal["Objectif: ma performance énergétique"] = "non"
            else:
                deal["Objectif: ma performance énergétique"] = "oui"
            return
    except json.JSONDecodeError:
        pass

    # option 2 : old formats
    for objectif in OBJECTIFS:
        start_index = other_data.find(objectif)
        if start_index != -1:
            stop_index = min(start_index + 40, len(other_data))
            subset_s = other_data[start_index:stop_index]
            match = re.search(r"(oui|non)", subset_s)
            if match:
                deal["Objectif: " + objectif] = match.group(0)
        else:
            deal["Objectif: " + objectif] = "Non spécifié"


def get_code_postal(s):
    postal_code_pattern = r"\b\d{5}\b"
    matches = re.findall(postal_code_pattern, s)
    if len(matches) == 0:
        return ""
    if len(matches) > 1:
        print("warning, more than 1 postal code found !")
    return matches[0]


def export_merge(merged_data, to_json, to_csv):
    if to_json:
        write_json(merged_data, "deals_with_contact_info.json")
    if to_csv:
        columns = [
            "créé le",
            "Etape de l'opportunité",
            "Contact_email",
            "Contact_NOM",
            "Contact_PRENOM",
            "Contact_TEL",
            "Contact_SIRET",
            "Code NAF",
            "Contact_DENOMINATION",
            "Contact_SECTEUR_D_ACTIVITE",
            "Contact_STRUCTURE_TAILLE",
            "Code Postal",
            "Région",
            "nom du dispositif",
            "lien du dispositif",
            "opérateur_de_contact",
        ]

        for objectif in OBJECTIFS:
            columns.append("Objectif: " + objectif)

        columns.extend(
            [
                "message",
                "autres_donnes",
                "dealId",
            ]
        )
    with open(
        "deals_with_contact_info.csv", mode="w", newline="", encoding="utf-8"
    ) as file:
        writer = csv.DictWriter(file, fieldnames=columns)
        writer.writeheader()
        for item in merged_data:
            row = {column: item.get(column, "") for column in columns}
            writer.writerow(row)
    print("Brevo data exporté dans deals_with_contact_info.*")


if __name__ == "__main__":
    brevo_config = initialize_brevo_configuration()

    # Import and prepare Contacts
    json_contact_list = get_brevo_contacts(brevo_config, REFRESH_CONTACTS)
    json_contact_list = [flatten_json(x, "attributes") for x in json_contact_list]

    # Import and prepare Deals
    json_deal_list = get_brevo_deals(brevo_config, REFRESH_DEALS)
    json_deal_list = [flatten_json(x, "_attributes") for x in json_deal_list]

    # keep only the deals on the prod pipeline
    json_deal_list = filter_deals(json_deal_list)

    # Merging
    merge_contact_in_deal(json_deal_list, json_contact_list)
    improve_merge_data(json_deal_list)
    export_merge(json_deal_list, EXPORT_TO_JSON, EXPORT_TO_CSV)
