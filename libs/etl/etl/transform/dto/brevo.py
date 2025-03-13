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


# old format :
#             new_contacts = [
#                 {
#                     "id": str(contact["id"]),
#                     "SIRET": contact["attributes"].get("SIRET", ""),
#                 }
#                 for contact in current_contacts
#             ]
# this should be done in transform !


# def _convert_raw_deals_to_brevo_deals(self, deals, contacts):
#     brevo_deals = []
#     for deal in deals:
#         attributes = deal["attributes"]
#         siret = self.get_siret(attributes.get("autres_donnes", ""))
#         if "linkedContactsIds" in deal and deal["linkedContactsIds"]:
#             matched_contact = next(
#                 (
#                     contact
#                     for contact in contacts
#                     if contact["id"] == str(deal["linkedContactsIds"][0])
#                 ),
#                 None,
#             )
#             if matched_contact:
#                 siret = matched_contact["SIRET"]

#         creation_date = attributes["created_at"]
#         name = attributes["deal_name"]
#         status = DealStageIdToStage.get(attributes["deal_stage"])
#         pipeline = attributes["pipeline"]
#         opportunity_type = attributes["type"]

#         if not status:
#             continue

#         brevo_deals.append(
#             {
#                 "dealId": deal["id"],
#                 "creationDate": creation_date,
#                 "status": status,
#                 "pipeline": pipeline,
#                 "siret": siret,
#                 "name": name,
#                 "opportunityType": opportunity_type,
#             }
#         )

#     return [
#         deal
#         for deal in brevo_deals
#         if deal["pipeline"] == "65719d9023acb4f05e56e7eb"
#     ]
