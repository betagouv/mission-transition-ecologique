import time
from etl.extract.baserow_extractor import BaserowExtractor
from etl.load.programs import update_programs
from etl.transform.program import Program
from etl.tools.db_manager import DBManager
from etl.tools.db_structure import TableName


class ProgramsPipeline:
    def update_program_table(self):
        raw_programs = BaserowExtractor().get_programs()

        DBManager().clear_programs_table()
        prodPrograms = [
            program
            for program in raw_programs
            if program.get("Statuts") is not None and (program["Statuts"][0].get("value") == "En prod" or program["Statuts"][0].get("value") == "Temporairement indispo")
        ]
        programs = [Program("baserow", program) for program in prodPrograms]
        print(programs)

        update_programs(programs)

ProgramsPipeline().update_program_table()
