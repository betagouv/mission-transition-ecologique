import time
from siren.sirene import get_establishment_sirene
from .db_manager import db_manager
from .types import DBCompany, NAF, NAFdata, Commune
from static import communes, naf_mapping


class CompaniesManager:
    async def get_new_sirets(self):
        query = """
            SELECT DISTINCT siret FROM statistics.web_registered_siret
            UNION
            SELECT DISTINCT company_siret FROM statistics.opportunities
            EXCEPT
            SELECT DISTINCT siret FROM statistics.companies;
        """
        try:
            result = await db_manager.query(query)
            return [row["siret"] for row in result]
        except Exception as e:
            print(f"Error fetching new SIRETs: {e}")
            return []

    async def fetch_siret_details(self, sirets):
        valid_companies = []
        for siret in sirets:
            try:
                establishment = await get_establishment_sirene(siret)
                if establishment.is_ok:
                    valid_companies.append(
                        self.convert_to_db_company(establishment.value)
                    )
            except Exception as e:
                print(f"Error fetching SIRET {siret}: {e}")
            time.sleep(3)  # sleep to throttle API requests
        return valid_companies

    def convert_to_db_company(self, establishment):
        naf = self.get_naf_details(establishment["nafCode"])
        workforce_category = (
            establishment["workforceRange"]
            if establishment["workforceRange"] != "NN"
            else "null"
        )
        return DBCompany(
            siret=establishment["siret"],
            naf_section=naf["section"],
            naf_division=naf["division"],
            naf_group=naf["groupe"],
            naf_class=naf["classe"],
            naf_code=naf["naf"],
            city_code=establishment["address"]["cityCode"],
            department=self.get_department(
                establishment["address"]["cityCode"],
                establishment["address"]["zipCode"],
            ),
            region=self.get_region(
                establishment["address"]["cityCode"],
                establishment["address"]["zipCode"],
            ),
            workforce_category=workforce_category,
            workforce_min=self.get_workforce_range(establishment["workforceRange"])[0],
            workforce_max=self.get_workforce_range(establishment["workforceRange"])[1],
        )

    async def batch_insert_companies(self, companies):
        if not companies:
            return

        values = ", ".join(
            [
                f"('{c.siret}', '{c.naf_section}', '{c.naf_division}', '{c.naf_group}', "
                f"'{c.naf_class}', '{c.naf_code}', '{c.city_code}', '{c.department}', "
                f"{self.escape_string(c.region)}, {c.workforce_category}, {c.workforce_min}, {c.workforce_max})"
                for c in companies
            ]
        )

        query = f"""
            INSERT INTO statistics.companies (
                siret, naf_section, naf_division, naf_group, naf_class,
                naf_code, city_code, department, region, workforce_category,
                workforce_min, workforce_max
            ) VALUES {values}
            ON CONFLICT (siret) DO NOTHING;
        """

        try:
            await db_manager.query(query)
            print(f"Inserted {len(companies)} new companies.")
        except Exception as e:
            print(f"Error inserting companies: {e}")

    async def process_new_sirets(self):
        sirets = await self.get_new_sirets()
        if not sirets:
            print("No new SIRETs to process.")
            return

        print(f"Number of SIRETs to add: {len(sirets)}")

        batch_size = 5
        for i in range(0, len(sirets), batch_size):
            batch = sirets[i : i + batch_size]
            try:
                companies = await self.fetch_siret_details(batch)
                await self.batch_insert_companies(companies)
                print(f"Successfully processed batch {i // batch_size + 1}")
            except Exception as e:
                print(f"Failed to process batch {i // batch_size + 1}: {e}")

    def get_workforce_range(self, tranche):
        salary_ranges = {
            "00": [0, 0],
            "01": [1, 2],
            "02": [3, 5],
            "03": [6, 9],
            "11": [10, 19],
            "12": [20, 49],
            "21": [50, 99],
            "22": [100, 199],
            "31": [200, 249],
            "32": [250, 499],
            "41": [500, 999],
            "42": [1000, 1999],
            "51": [2000, 4999],
            "52": [5000, 99999],
            "53": [10000, 1000000],
        }
        return salary_ranges.get(tranche, [None, None])

    def escape_string(self, value):
        if value is None:
            return "NULL"
        return f"'{value.replace("'", "''")}'"

    def get_department(self, city_code, zip_code):
        commune = next(
            (
                c
                for c in communes
                if c["code"] == city_code or zip_code in c["codesPostaux"]
            ),
            None,
        )
        return commune["departement"]["code"] if commune else "999"

    def get_region(self, city_code, zip_code):
        commune = next(
            (
                c
                for c in communes
                if c["code"] == city_code or zip_code in c["codesPostaux"]
            ),
            None,
        )
        return commune["region"]["nom"] if commune else "999"

    def get_naf_details(self, naf_code):
        naf_data = next(
            (data for data in naf_mapping if data["NIV5"] == naf_code), None
        )
        return {
            "naf": naf_data["NIV5"] if naf_data else "null",
            "section": naf_data["NIV1"] if naf_data else "null",
            "division": naf_data["NIV2"] if naf_data else "null",
            "groupe": naf_data["NIV3"] if naf_data else "null",
            "classe": naf_data["NIV4"] if naf_data else "null",
        }
