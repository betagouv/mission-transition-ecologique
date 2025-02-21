import psycopg2
from etl.tools.db_manager import DBManager


def init_db():
    """Executes schema.sql to initialize the database."""
    try:
        with open("db/schema.sql", "r") as f:
            sql_script = f.read()
            DBManager().execute_script(sql_script)

    except Exception as e:
        print(f"❌ Error initializing database: {e}")


def reset_test_db():
    DBManager().query("DROP SCHEMA statistics_test CASCADE;")


if __name__ == "__main__":
    init_db()
