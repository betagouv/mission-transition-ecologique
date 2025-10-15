from etl.transform.program import Program
from etl.tools.db_manager import DBManager
from etl.tools.db_structure import TableName


def update_programs(programs):
    if not programs:
        return

    query = f"""
        INSERT INTO __SCHEMA_NAME__.{TableName.PROGRAMS} (
            {Program.ID},
            {Program.SLUG},
            {Program.NAME},
            {Program.THEMES},
            {Program.AID_TYPE},
            {Program.CONTACT_OPERATOR},
            {Program.OTHER_OPERATORS},
            {Program.LINKED_PROJECTS},
            {Program.SECTOR_ELIGIBILITY},
            {Program.GEOGRAPHY_ELIGIBILITY},
            {Program.MIN_EMPLOYEE},
            {Program.MAX_EMPLOYEE}
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = [
        (
            program.id,
            program.slug,
            program.name,
            program.themes,
            program.aid_type,
            program.contact_operator,
            program.other_operators,
            program.linked_projects,
            program.sector_eligibility,
            program.geography_eligibility,
            program.min_employee,
            program.max_employee,
        )
        for program in programs
    ]

    try:
        DBManager().query(query, values)
    except Exception as error:
        print("Error during the program update query:", error)
