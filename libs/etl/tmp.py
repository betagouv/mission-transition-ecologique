# from etl.extract.data_provider import DataProvider
# from etl.extract.siren import SireneAPIClient
# from etl.tools.db_manager import DBManager
# from etl.extract.db_queries import
force_refresh = False
from etl.pipelines.companies_pipeline import CompaniesPipeline
from etl.pipelines.database_update import update_database

# # test = DataProvider().get_deals(force_refresh)
# # print(len(test))
# test = DataProvider().get_contacts(force_refresh)
# print(len(test))

# # extractor = SireneAPIClient()
# # results = extractor.get_establishments(["49839893200018", "90898229100019"])
# # print(results)


# # db_manager = DBManager()
# # count = db_manager.query("SELECT COUNT(*) FROM __SCHEMA_NAME__.companies;")
# # print(count)

# data = DataProvider().get_form_events()
# print(len(data))


# data = DataProvider().get_siret_events("2025-02-10", "2025-02-12")
# print(len(data))


# data = DataProvider().get_unique_visitors_by_date_range("2025-02-10", "2025-02-15")
# print(len(data))

# test = update_database()

from db.init_db import init_db

init_db()
