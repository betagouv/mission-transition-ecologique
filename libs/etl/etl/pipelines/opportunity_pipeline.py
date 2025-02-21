from etl.extract.generic_extractor import GenericExtractor
from etl.tools.db_manager import DBManager
from etl.transform.deals import Deal
from etl.load.deals import update_deals


class OpportunityPipeline:
    def update_opportunity_table(self):
        raw_deals = GenericExtractor().get_deals()
        deals = [Deal("brevo", deal) for deal in raw_deals]
        prod_deals = [deal for deal in deals if deal.environment == "production"]
        update_deals(prod_deals)
