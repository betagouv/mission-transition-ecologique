from etl.pipelines.companies_pipeline import CompaniesPipeline
from etl.pipelines.web_stats_pipeline import WebStatsPipeline


def update_database():
    update_web_sirets = True
    update_web_visits = True
    update_opportunities = True
    update_company_data = True

    print("▶ Starting the database updates\n")

    if update_web_sirets:
        print("▶ Update the web registration siret events")
        WebStatsPipeline().update_web_registered_siret_table()

    if update_web_visits:
        print("▶ Update the web visitor statistics")
        WebStatsPipeline().update_website_daily_visit_stats()

    # if update_opportunities:
    #     print("▶ Update the opportunities")
    #     OpportunityManager().update_opportunity_table()

    if update_company_data:
        print("▶ Add new sirets in the company table")
        CompaniesPipeline().process_new_sirets()

    print("End of the database update")


if __name__ == "__main__":
    update_database()
