from etl.transform.project import Project
from etl.tools.db_manager import DBManager
from etl.tools.db_structure import TableName


def update_projects(projects):
    if not projects:
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.{TableName.PROJECTS} (
            {Project.ID},
            {Project.SLUG},
            {Project.NAME},
            {Project.SECTOR_ELIGIBILITY},
            {Project.RELATED_PROGRAMS},
            {Project.THEMES}
        ) VALUES (%s, %s, %s, %s, %s, %s)
    """

    values = [
        (
            project.id,
            project.slug,
            project.name,
            project.sector_eligibility,
            project.related_programs,
            project.themes,
        )
        for project in projects
    ]

    try:
        DBManager().query(query, values)
    except Exception as error:
        print("Error during the project update query:", error)
