import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv


class DBManager:
    def __init__(self):
        load_dotenv()
        self.pool = psycopg2.pool.SimpleConnectionPool(
            1,  # Min connections in the pool
            20,  # Max connections in the pool
            user=os.getenv("DB_USER"),
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            password=os.getenv("DB_PASSWORD"),
            port=int(os.getenv("DB_PORT")),
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
        schema_name = "statistics_test" if os.getenv("TEST") == "True" else "statistics"
        return string_data.replace("__SCHEMA_NAME__", schema_name)
