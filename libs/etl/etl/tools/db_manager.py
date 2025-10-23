import psycopg2
from psycopg2 import pool
from etl.tools.db_structure import TableName
from etl.tools.config.config import Config


class DBManager:

    def __init__(self):
        self.pool = psycopg2.pool.SimpleConnectionPool(
            1,  # Min connections in the pool
            5,  # Max connections in the pool
            user=Config.DB_USER(),
            host=Config.DB_HOST(),
            database=Config.DB_NAME(),
            password=Config.DB_PASSWORD(),
            port=Config.DB_PORT(),
            sslmode="require",
        )

    def query(self, query_text, params=None):
        if params is None:
            params = []

        connection = None
        cursor = None
        try:
            connection = self.pool.getconn()
            cursor = connection.cursor()
            if query_text.strip().lower().startswith("select"):
                cursor.execute(self._replace_schema_name(query_text), params)
                result = cursor.fetchall()
                return result
            elif query_text.strip().lower().startswith("insert"):
                cursor.executemany(self._replace_schema_name(query_text), params)
                connection.commit()
                return None
            else:
                cursor.execute(self._replace_schema_name(query_text), params)
                connection.commit()
                return None
        except Exception as e:
            print(f"Database Query Error: {e}")
            raise e
        finally:
            if cursor:
                cursor.close()
            if connection:
                self.pool.putconn(connection)

    def execute_script(self, sql_script):
        """Executes a full SQL script (for schema creation, migrations, etc.)."""
        connection = None
        cursor = None
        try:
            connection = self.pool.getconn()
            cursor = connection.cursor()
            cursor.execute(self._replace_schema_name(sql_script))
            connection.commit()
        except Exception as e:
            print(f"❌ Error executing the SQL script: {e}")
            raise e
        finally:
            if cursor:
                cursor.close()
            if connection:
                self.pool.putconn(connection)

    def _replace_schema_name(self, string_data):
        schema_name = "statistics_test" if Config.TEST() else "statistics"
        return string_data.replace("__SCHEMA_NAME__", schema_name)

    def clear_projects_table(self):
        self.clear_table(TableName.PROJECTS)

    def clear_programs_table(self):
        self.clear_table(TableName.PROGRAMS)

    def clear_table(self, table_name):
        query = f"TRUNCATE TABLE __SCHEMA_NAME__.{table_name} RESTART IDENTITY;"
        try:
            self.query(query)
        except Exception as e:
            print("Failed to clear table: " + table_name, e)
