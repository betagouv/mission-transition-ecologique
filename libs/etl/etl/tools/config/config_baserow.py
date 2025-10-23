from etl.tools.config.config import Config


class ConfigBaserow(Config):
    _PROJECT_TABLE_ID = 305253
    _PROGRAM_TABLE_ID = 314437

    @classmethod
    def PROJECT_TABLE_ID(cls) -> int:
        return int(
            Config.get_env_value(
                "BASEROW_PROJECT_TABLE_ID", ConfigBaserow._PROJECT_TABLE_ID
            )
        )

    @classmethod
    def PROGRAM_TABLE_ID(cls) -> int:
        return int(
            Config.get_env_value(
                "BASEROW_PROGRAM_TABLE_ID", ConfigBaserow._PROGRAM_TABLE_ID
            )
        )
