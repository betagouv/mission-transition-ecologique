from etl.pipelines.companies_pipeline import CompaniesPipeline
from etl.pipelines.web_stats_pipeline import WebStatsPipeline
from etl.pipelines.opportunity_pipeline import OpportunityPipeline
from etl.pipelines.programs_pipeline import ProgramsPipeline
from etl.pipelines.projects_pipeline import ProjectsPipeline

def update_database():
    print("▶ Starting the database updates")

    print("\n▶ Update the web registration siret events")
    WebStatsPipeline().update_web_registered_siret_table()

    print("\n▶ Update the web visitor statistics")
    WebStatsPipeline().update_website_daily_visit_stats()

    print("\n▶ Update the external link click events")
    WebStatsPipeline().update_external_link_clicked_table()

    print("\n▶ Update the detail pages visit events")
    WebStatsPipeline().update_detail_page_view_table()

    print("\n▶ Update the opportunities")
    OpportunityPipeline().update_opportunity_table()

    print("\n▶ Add new sirets in the company table")
    CompaniesPipeline().process_new_sirets()

    print("\n▶ Updating the program table")
    ProgramsPipeline().update_program_table()

    print("\n▶ Updating the project table")
    ProjectsPipeline().update_project_table()

    print("\nEnd of the database update")


if __name__ == "__main__":
    update_database()
