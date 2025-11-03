import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    @staticmethod
    def TEST():
        return os.getenv("ETL_TEST").strip().lower() != "false"

    @staticmethod
    def DB_PORT():
        return int(Config.get_env_value("DB_PORT"))

    @staticmethod
    def get_env_value(name, default_value=None):
        value = os.getenv(name)
        if value is None:
            if default_value is not None:
                return default_value
            raise RuntimeError(f"Expected environment variable {name} is not defined")
        return value

for _var in [
    "BREVO_API_TOKEN",
    "BASEROW_TOKEN",
    "POSTHOG_PROJECT_ID",
    "POSTHOG_READ_API_KEY",
    "SIRENE_API_311_TOKEN",
    "POSTHOG_WRITE_API_KEY",
    "DB_USER",
    "DB_HOST",
    "DB_NAME",
    "DB_PASSWORD",
]:
    setattr(Config, _var, classmethod(lambda cls, n=_var: cls.get_env_value(n)))
