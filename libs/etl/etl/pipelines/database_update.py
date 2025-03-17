from etl.pipelines.companies_pipeline import CompaniesPipeline
from etl.pipelines.web_stats_pipeline import WebStatsPipeline
from etl.pipelines.opportunity_pipeline import OpportunityPipeline


def update_database():
    print("▶ Starting the database updates")

    # print("\n▶ Update the web registration siret events")
    # WebStatsPipeline().update_web_registered_siret_table()

    print("\n▶ Update the web visitor statistics")
    WebStatsPipeline().update_website_daily_visit_stats()

    # print("\n▶ Update the opportunities")
    # OpportunityPipeline().update_opportunity_table()

    # print("\n▶ Add new sirets in the company table")
    # CompaniesPipeline().process_new_sirets()

    print("\nEnd of the database update")


if __name__ == "__main__":
    update_database()
