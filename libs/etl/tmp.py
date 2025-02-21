from etl.pipelines.database_update import update_database
from db.init_db import init_db, reset_test_db

# reset_test_db()
# init_db()
test = update_database()
