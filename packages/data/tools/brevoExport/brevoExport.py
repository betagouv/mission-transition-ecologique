#!/usr/bin/env python3
import json
import csv
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from datetime import datetime
import pytz
import re
import os

brevo_token_file_path = "../../../backend/.env"
refresh_contacts = True
refresh_deals = True


def read_brevo_api_key(filepath):
    if not os.path.isfile(filepath):
        print(f"Error: env file '{filepath}' does not exist.")
    with open(filepath, "r") as file:
        lines = file.readlines()

    for line in lines:
        if line.startswith("BREVO_API_TOKEN="):
            token = line.split("=")[1].strip()
            return token
    else:
        print("Error: BREVO_API_TOKEN not found in the environment file.")


BREVO_API_KEY = read_brevo_api_key(brevo_token_file_path)
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key["api-key"] = BREVO_API_KEY


def write_json(data, filename):
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)


def read_json(filename):
    with open(filename, "r") as file:
        data = json.load(file)
        return data


def get_brevo_contacts(origin):
    contact_list = []
    if origin:
        api_instance = sib_api_v3_sdk.ContactsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )
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
            print(f"Exported {len(contact_list)} brevo contacts")
        except ApiException as e:
            print("Exception when calling ContactsApi->get_contacts: %s\n" % e)
    else:
        contact_list = read_json("brevoContacts.json")
        print(f"Read {len(contact_list)} brevo contacts")

    return contact_list


def serialize_deal(deal):
    if isinstance(deal, dict):
        return deal
    elif hasattr(deal, "__dict__"):
        return deal.__dict__
    else:
        return str(deal)


def get_brevo_deals(origin):
    deal_list = []
    if origin:
        api_instance = sib_api_v3_sdk.DealsApi(sib_api_v3_sdk.ApiClient(configuration))
        limit = 1000000  # Allowed value that largely exceed the nomber of deals we have
        offset = 0
        try:
            api_response = api_instance.crm_deals_get(limit=limit, offset=offset)
            deal_list.extend(api_response.items)
            json_data = json.dumps(
                [serialize_deal(deal) for deal in deal_list], default=str, indent=4
            )
            with open("brevoDeals.json", "w") as file:
                file.write(json_data)
            print(f"Exported {len(deal_list)} brevo deals")
        except ApiException as e:
            print("Exception when calling DealApi->crm_deals_get: %s\n" % e)

    deal_list = read_json("brevoDeals.json")
    print(f"Read {len(deal_list)} brevo deals")
    return deal_list


def flatten_json(json_obj, obj_name):
    flattened = {}
    attributes = json_obj.pop(obj_name, {})
    for key, value in attributes.items():
        flattened[key] = value
    flattened.update(json_obj)
    return flattened


def export_to_csv(data, csv_file_path):
    keys = get_all_keys(data)
    with open(csv_file_path, "w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=keys)
        writer.writeheader()
        for obj in data:
            writer.writerow(obj)


def get_all_keys(json_list):
    all_keys = set()
    for obj in json_list:
        all_keys.update(obj.keys())
    return sorted(all_keys)


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


def define_structure_size(deal):
    size = ""
    if "Contact_TAILLE" in deal and deal["Contact_TAILLE"] != "":
        workforce_to_type = {"1": "TPE", "2": "PME", "3": "PME", "4": "ETI,GE"}
        size = workforce_to_type[deal["Contact_TAILLE"]]
    elif "autres_donnes" in deal and deal["autres_donnes"] != "":
        pattern = r"/ structure_sizes: (.+?) /"
        match = re.search(pattern, deal["autres_donnes"])
        if match:
            size = match.group(1)
    elif "Contact_STRUCTURE_SIZE" in deal:
        size = deal["Contact_STRUCTURE_SIZE"]
    deal["Contact_STRUCTURE_TAILLE"] = size


def format_date(date):
    dt_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
    utc_timezone = pytz.utc
    paris_timezone = pytz.timezone("Europe/Paris")
    dt_obj_paris = dt_obj.astimezone(paris_timezone)
    return dt_obj_paris.strftime("%Y-%m-%d à %H-%M")


def improve_merge_data(data):
    for deal in data:
        deal["dealId"] = deal.pop("_id")
        deal["créé le"] = format_date(deal["created_at"])
        define_structure_size(deal)
        deal["nom du dispositif"] = deal.pop("deal_name")
        deal["lien du dispositif"] = (
            "https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise/"
            + deal["nom du dispositif"]
        )
        deal["opérateur_de_contact"] = deal.pop("oprateur_de_contact")
        if deal["deal_stage"] == "f0f8a5c8-023b-46cc-9826-1c5da7abc1f0":
            deal["Etape de l'opportunité"] = "Nouvelle"
        elif deal["deal_stage"] == "659d15cff01695.94588187":
            deal["Etape de l'opportunité"] = "Transmise"
        else:
            deal["Etape de l'opportunité"] = "Inconnue"
            print("unexpected deal stage", deal["deal_stage"])
        if "autres_donnes" in deal and deal["autres_donnes"] != "[]":
            deal["Code Postal"] = get_code_postal(deal["autres_donnes"])
            deal["Région"] = get_region(deal["autres_donnes"], deal["Code Postal"])
            create_objectifs_columns(deal, deal["autres_donnes"])
            deal["Code NAF"] = get_NAF(deal["autres_donnes"])

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


objectifs = [
    "mon impact environnemental",
    "ma performance \u00e9nerg\u00e9tique",
    "diminuer ma consommation d'eau",
    "r\u00e9nover mon b\u00e2timent",
    "la mobilit\u00e9 durable",
    "la gestion des d\u00e9chets",
    "l'\u00e9coconception",
    "former ou recruter",
]


def create_objectifs_columns(deal, s):
    for objectif in objectifs:
        start_index = s.find(objectif)
        if start_index != -1:
            subset_s = s[start_index:]
            match = re.search(r"(oui|non)", subset_s)
            if match:
                deal["Objectif: " + objectif] = match.group(0)


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
            "parcours",
        ]

        for objectif in objectifs:
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


def filter_deals(json_deal_list):
    filtered_deals = []
    filtered_pipeline_counts = {}

    for deal in json_deal_list:
        if (
            deal["pipeline"] == "65719d9023acb4f05e56e7eb"
            and deal["deal_stage"] != "C8DrOEJbVoiqtWZHQbMHyxF"
        ):
            filtered_deals.append(deal)
        else:
            if deal["pipeline"] == "65719d9023acb4f05e56e7eb":
                print("filtergint with the stage", deal["deal_stage"])
            pipeline_number = deal["pipeline"]
            if pipeline_number in filtered_pipeline_counts:
                filtered_pipeline_counts[pipeline_number] += 1
            else:
                filtered_pipeline_counts[pipeline_number] = 1

    print("Number of filtered elements:", len(json_deal_list) - len(filtered_deals))
    print("Détail des deals filtrés par pipeline :", filtered_pipeline_counts)
    return filtered_deals


if __name__ == "__main__":
    # Import, prepare, and export Contacts
    json_contact_list = get_brevo_contacts(refresh_contacts)
    json_contact_list = [flatten_json(x, "attributes") for x in json_contact_list]
    export_to_csv(json_contact_list, "contact.csv")

    # Import, prepare, and export Deals
    json_deal_list = get_brevo_deals(refresh_deals)
    json_deal_list = [flatten_json(x, "_attributes") for x in json_deal_list]
    export_to_csv(json_deal_list, "deals.csv")

    json_deal_list = filter_deals(
        json_deal_list
    )  # keep only the deals NOT DELETED on the prod pipeline
    # Merging

    merge_contact_in_deal(json_deal_list, json_contact_list)

    improve_merge_data(json_deal_list)
    to_json = True
    to_csv = True
    export_merge(json_deal_list, to_json, to_csv)
