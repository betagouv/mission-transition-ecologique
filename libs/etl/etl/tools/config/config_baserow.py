from etl.tools.config.config import Config


class ConfigBaserow(Config):
    PROJECT_TABLE_ID = 305253
    PROGRAM_TABLE_ID = 314437

    @classmethod
    def PROJECT_TABLE_ID(cls) -> int:
        return int(
            cls.get_env_value("BASEROW_PROJECT_TABLE_ID", str(cls.PROJECT_TABLE_ID))
        )

    @classmethod
    def PROGRAM_TABLE_ID(cls) -> int:
        return int(
            cls.get_env_value("BASEROW_PROGRAM_TABLE_ID", str(cls.PROGRAM_TABLE_ID))
        )
