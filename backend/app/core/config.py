from functools import lru_cache
from typing import List, Literal, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    PixelDesk Backend Configuration.
    Loads settings from environment variables and local .env files.
    """
    APP_NAME: str = "PixelDesk API"
    APP_VERSION: str = "0.1.0"
    APP_ENV: Literal["development", "production", "testing"] = "development"
    DEBUG: bool = False

    API_V1_PREFIX: str = "/api/v1"

    # PostgreSQL Database URL with asyncpg driver
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/pixeldesk_dev"
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30

    # JWT Authentication Secret (must be replaced with a secure secret in production)
    JWT_SECRET: str = "dev_secret_insecure_replace_in_production_min_32_chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS Allowed Origins
    FRONTEND_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, v: str) -> str:
        if isinstance(v, str):
            # Convert postgres:// or standard postgresql:// to asyncpg dialect
            if v.startswith("postgres://"):
                v = v.replace("postgres://", "postgresql+asyncpg://", 1)
            elif v.startswith("postgresql://") and not v.startswith("postgresql+asyncpg://"):
                v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    @field_validator("FRONTEND_ORIGINS", mode="before")
    @classmethod
    def parse_frontend_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            # Parse comma-separated string into list
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return [str(origin).strip() for origin in v if str(origin).strip()]
        return ["http://localhost:5173", "http://127.0.0.1:5173"]

    @field_validator("JWT_SECRET")
    @classmethod
    def validate_jwt_secret_in_production(cls, v: str, info) -> str:
        env = info.data.get("APP_ENV", "development")
        if env == "production":
            if not v or "insecure" in v.lower() or len(v) < 32:
                raise ValueError(
                    "A secure JWT_SECRET with at least 32 characters is required in production environment."
                )
        return v

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def is_testing(self) -> bool:
        return self.APP_ENV == "testing"

    @property
    def masked_database_url(self) -> str:
        """Return database connection string with password masked for safe logging."""
        try:
            if "@" in self.DATABASE_URL:
                prefix, host_part = self.DATABASE_URL.split("@", 1)
                if ":" in prefix:
                    scheme_user = prefix.rsplit(":", 1)[0]
                    return f"{scheme_user}:***@{host_part}"
            return "postgresql+asyncpg://***"
        except Exception:
            return "postgresql+asyncpg://***"


@lru_cache()
def get_settings() -> Settings:
    """Return cached application settings singleton."""
    return Settings()


settings = get_settings()
