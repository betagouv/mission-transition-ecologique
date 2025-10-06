import time
from etl.extract.baserow_extractor import BaserowExtractor
from etl.load.projects import update_projects
from etl.transform.project import Project
from etl.tools.db_manager import DBManager
from etl.tools.db_structure import TableName


class ProjectsPipeline:
    def update_project_table(self):
        raw_projects = BaserowExtractor().get_projects()

        DBManager().clear_projects_table()
        prodProjects = [
            project
            for project in raw_projects
            if project.get("Statut") is not None and project["Statut"].get("value") == "En prod"
        ]
        projects = [Project("baserow", project) for project in prodProjects]
        update_projects(projects)

# ProjectsPipeline().update_project_table()
