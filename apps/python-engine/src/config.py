import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the file path of the .env file located in the root of the project
ENV_FILE_PATH = Path(__file__).resolve().parent.parent.parent.parent / ".env"

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding="utf-8",
        extra="ignore"  # Ignore any extra environment variables not defined in the Settings class
    )

settings = Settings()