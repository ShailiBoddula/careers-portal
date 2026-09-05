from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    database_url: str = "sqlite:///./careers.db"
    jwt_secret: str = "super-secret-key-careers-page-builder-jwt-token-key-2025"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    frontend_url: str = "http://localhost:5173"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    class Config:
        env_file = ".env"
        extra = "allow"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
