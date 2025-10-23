import time
from etl.extract.config.extractor import Extractor
from etl.extract.baserow_extractor import BaserowExtractor
from etl.load.projects import update_projects
from etl.transform.project import Project
from etl.tools.db_manager import DBManager
from etl.tools.db_structure import TableName


class ProjectsPipeline:
    def update_project_table(self):
        prod_projects = BaserowExtractor().get_in_prod_projects()
        projects = [Project(Extractor.BASEROW, project) for project in prod_projects]
        if len(projects):
            DBManager().clear_projects_table()
            update_projects(projects)


if __name__ == '__main__':
    ProjectsPipeline().update_project_table()
