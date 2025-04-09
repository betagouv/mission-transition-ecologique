import re
from datetime import datetime


def deal_from_brevo(deal, raw_data, raw_contacts):
    attributes = raw_data["_attributes"]
    deal.brevo_id = raw_data["_id"]
    deal.opportunity_date = set_date(attributes["created_at"])
    deal.company_siret = get_siret(raw_data, raw_contacts)
    deal.status = set_status(attributes["deal_stage"])
    deal.operator = attributes.get("oprateur_de_contact")
    deal.opportunity_type = set_opportunity_type(attributes.get("type"))
    deal.opportunity_title = attributes["deal_name"]
    deal.partner_id_ce = attributes.get("idce")
    deal.environment = set_environment(attributes["pipeline"])
    return deal


def set_environment(pipeline):
    return "production" if pipeline == "65719d9023acb4f05e56e7eb" else "test"


def get_siret(raw_data, raw_contacts):
    if len(raw_data["_linked_contacts_ids"]) > 0:
        matched_contact = next(
            (
                contact
                for contact_id in raw_data["_linked_contacts_ids"]
                for contact in raw_contacts
                if str(contact["id"]) == str(contact_id)
            ),
            None,
        )

        if matched_contact:
            siret = (
                matched_contact.get("attributes", "").get("SIRET", "").replace(" ", "")
            )
            if len(siret) == 14:
                return siret

    other_data = raw_data["_attributes"].get("autres_donnes", "")
    if not other_data:
        return ""
    match = re.search(r'"siret":"(\d+)"', other_data)
    return match.group(1).replace(" ", "") if match else ""


def set_status(deal_stage):
    if deal_stage == "f0f8a5c8-023b-46cc-9826-1c5da7abc1f0":
        return "Nouvelle"
    elif deal_stage == "659d15cff01695.94588187":
        return "Transmise"
    elif deal_stage == "c1d2ed92-8bc3-492d-a3ec-0284e214baa0":
        return "Perdue"
    elif deal_stage == "659d15cff06be7.98275409":
        return "Aide Proposée"
    elif deal_stage == "1e33531f-0eef-40ea-b97c-35aadc929446":
        return "Gagnée"
    else:
        return "Inconnue"


def set_opportunity_type(type):
    type_mapping = {
        "program": "program",
        "project": "projet",
        "customProject": "projet personnalisé",
    }
    return type_mapping.get(type, type)


def set_date(date_str):
    date_str = date_str.rstrip("Z")
    return datetime.fromisoformat(date_str)
