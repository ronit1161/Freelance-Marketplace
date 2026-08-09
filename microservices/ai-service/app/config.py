import os
# pyrefly: ignore [missing-import]
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Microservice"
    app_env: str = "development"
    host: str = "0.0.0.0"
    port: int = 8000
    
    # GenAI Settings
    gemini_api_key: str = "your_gemini_api_key_here"
    default_model: str = "gemini-2.5-flash"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
