import os
import psycopg2
from psycopg2 import pool


class DBManager:
    def __init__(self):
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
            cursor.execute(query_text, params)
            result = cursor.fetchall()
            return result
        except Exception as e:
            print(f"Database Query Error: {e}")
            raise e
        finally:
            if cursor:
                cursor.close()
            if connection:
                self.pool.putconn(connection)
