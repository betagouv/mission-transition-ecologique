#!/usr/bin/env python3
import json
import csv
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from datetime import datetime
import pytz
import re


BREVO_API_KEY = ""
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key["api-key"] = BREVO_API_KEY


def write_json(data, filename):
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)


def read_json(filename):
    with open(filename, "r") as file:
        data = json.load(file)
        return data


def get_brevo_contacts(origin=0):
    contact_list = []
    if not origin:
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


def get_brevo_deals(origin=0):
    deal_list = []
    if not origin:
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
    deal["Contact_size"] = size


def format_date(date):
    dt_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
    utc_timezone = pytz.utc
    paris_timezone = pytz.timezone("Europe/Paris")
    dt_obj_paris = dt_obj.astimezone(paris_timezone)
    return dt_obj_paris.strftime("%Y-%m-%d à %H-%M")


def improve_merge_data(data):
    for deal in data:
        deal["créé le"] = format_date(deal["created_at"])
        define_structure_size(deal)
        deal["nom du dispositif"] = deal.pop("deal_name")
        deal["opérateur_de_contact"] = deal.pop("oprateur_de_contact")
        if deal["deal_stage"] == "f0f8a5c8-023b-46cc-9826-1c5da7abc1f0":
            deal["Etape de l'opportunité"] = "Nouvelle"
        elif deal["deal_stage"] == "659d15cff01695.94588187":
            deal["Etape de l'opportunité"] = "Transmise"
        else:
            deal["Etape de l'opportunité"] = "Inconnue"
            print("unexpected deal stage", deal["deal_stage"])


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
            "Contact_DENOMINATION",
            "Contact_SECTEUR_D_ACTIVITE",
            "Contact_size",
            "autres_donnes",
            "nom du dispositif",
            "opérateur_de_contact",
            "message",
            "parcours",
        ]

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
    json_contact_list = get_brevo_contacts(0)  # 0 = from API, 1 = from local file
    json_contact_list = [flatten_json(x, "attributes") for x in json_contact_list]
    export_to_csv(json_contact_list, "contact.csv")

    # Import, prepare, and export Deals
    json_deal_list = get_brevo_deals(0)  # 0 = from API, 1 = from local file
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
