import psycopg2
from etl.tools.db_manager import DBManager
from dotenv import load_dotenv
import os


def init_db():
    """Executes schema.sql to initialize the database."""
    try:
        with open("db/schema.sql", "r") as f:
            sql_script = f.read()
            DBManager().execute_script(sql_script)

    except Exception as e:
        print(f"❌ Error initializing database: {e}")

    load_dotenv()
    if os.getenv("TEST") == "True":
        DBManager().query("GRANT ALL PRIVILEGES ON SCHEMA statistics_test TO PUBLIC;")
        DBManager().query(
            "GRANT INSERT, DELETE, UPDATE, TRUNCATE, REFERENCES, TRIGGER, SELECT ON ALL TABLES IN SCHEMA statistics_test TO PUBLIC;"
        )


def reset_test_db():
    DBManager().query("DROP SCHEMA statistics_test CASCADE;")


if __name__ == "__main__":
    init_db()
