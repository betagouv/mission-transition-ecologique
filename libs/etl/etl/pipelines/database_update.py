import asyncio
from common.database.companies_manager import CompaniesManager
from common.database.opportunity_manager import OpportunityManager
from common.database.web_stats_manager import WebStatsManager


async def update_database():
    update_web_sirets = True
    update_web_visits = True
    update_opportunities = True
    update_company_data = True

    print("▶ Starting the database updates\n")

    if update_web_sirets:
        print("▶ Update the web registration siret events")
        await WebStatsManager().update_web_registered_siret_table()

    if update_web_visits:
        print("▶ Update the web visitor statistics")
        await WebStatsManager().update_website_daily_visit_stats()

    if update_opportunities:
        print("▶ Update the opportunities")
        await OpportunityManager().update_opportunity_table()

    if update_company_data:
        print("▶ Add new sirets in the company table")
        await CompaniesManager().process_new_sirets()

    print("End of the database update")


# Run the update
asyncio.run(update_database())
