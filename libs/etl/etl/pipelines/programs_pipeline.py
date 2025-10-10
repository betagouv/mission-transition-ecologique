import time
from etl.extract.baserow_extractor import BaserowExtractor
from etl.load.programs import update_programs
from etl.transform.program import Program
from etl.tools.db_manager import DBManager
from etl.tools.db_structure import TableName


class ProgramsPipeline:
    def update_program_table(self):
        prod_programs = BaserowExtractor().get_in_prod_programs()
        programs = [Program("baserow", program) for program in prod_programs]
        if len(programs):
            DBManager().clear_programs_table()
            update_programs(programs)


if __name__ == '__main__':
    ProgramsPipeline().update_program_table()

