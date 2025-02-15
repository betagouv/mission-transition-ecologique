# old format :
#             new_contacts = [
#                 {
#                     "id": str(contact["id"]),
#                     "SIRET": contact["attributes"].get("SIRET", ""),
#                 }
#                 for contact in current_contacts
#             ]
# this should be done in transform !

# def get_siret(self, data):
#     if not data:
#         return ""
#     match = re.search(r'"siret":"(\d+)"', data)
#     return match.group(1) if match else ""

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
