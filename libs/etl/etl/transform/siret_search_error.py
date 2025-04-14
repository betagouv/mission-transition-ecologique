class SiretSearchError:
    SIRET = "siret"
    FAIL_COUNT = "fail_count"

    @staticmethod
    def keep_valid_sirets(sirets):
        from etl.extract.db_queries import get_invalid_sirets

        invalid_sirets = get_invalid_sirets()
        invalid_sirets.append(None)
        return [siret for siret in sirets if siret not in invalid_sirets]
