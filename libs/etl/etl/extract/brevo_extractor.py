import time
import sib_api_v3_sdk
from etl.tools.config.config import Config


class BrevoExtractor:

    def __init__(self):
        self._brevo_configuration = sib_api_v3_sdk.Configuration()
        self._brevo_configuration.api_key["api-key"] = Config.BREVO_API_TOKEN()

    def get_contacts(self):
        """Retrieves Brevo contacts using the Brevo API."""
        contact_list = []
        api_instance = sib_api_v3_sdk.ContactsApi(
            sib_api_v3_sdk.ApiClient(self._brevo_configuration)
        )
        limit = 1000  # max value to reduce the number of queries (20max per sec)
        offset = 0
        try:
            api_response = api_instance.get_contacts(limit=limit, offset=offset)
            offset += limit
            contact_list.extend(api_response.contacts)
            while offset < api_response.count:
                time.sleep(0.1)
                api_response = api_instance.get_contacts(limit=limit, offset=offset)
                offset += limit
                contact_list.extend(api_response.contacts)
            print(f"Import de {len(contact_list)} contacts Brevo via l'API brevo")
        except ApiException as e:
            print("Exception when calling ContactsApi->get_contacts: %s\n" % e)

        return contact_list

    def get_deals(self):
        """Retrieves Brevo deals using the Brevo API."""
        deal_list = []
        api_instance = sib_api_v3_sdk.DealsApi(
            sib_api_v3_sdk.ApiClient(self._brevo_configuration)
        )
        limit = 100000  # Allowed value largely > to our number of deals.
        try:
            api_response = api_instance.crm_deals_get(limit=limit)
            deal_list.extend(api_response.items)
            deal_list = [self.serialize_deal(deal) for deal in deal_list]
            print(f"Import de {len(deal_list)} Brevo deals via l'API brevo")
        except Exception as e:
            print("Exception using the brevo deal api: %s\n" % e)

        return deal_list

    def serialize_deal(self, deal):
        if isinstance(deal, dict):
            return deal
        elif hasattr(deal, "__dict__"):
            return deal.__dict__
        else:
            return str(deal)
