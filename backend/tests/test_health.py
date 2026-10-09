import asyncio
import pytest
from app.core.config import Settings
from app.db.session import check_db_connectivity


def test_root_endpoint(client):
    """Verify that root endpoint returns service metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "PixelDesk API"
    assert "version" in data
    assert data["status"] == "online"


def test_health_endpoint(client):
    """Verify lightweight health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "PixelDesk API"


def test_versioned_health_endpoint(client):
    """Verify versioned health check endpoint and database payload structure."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "database" in data
    assert "connected" in data["database"]
    assert "status" in data["database"]


def test_config_safe_defaults():
    """Verify configuration loads safely and masks credentials."""
    s = Settings(
        DATABASE_URL="postgresql+asyncpg://myuser:secretpass123@db.example.com:5432/pixeldesk",
        APP_ENV="development"
    )
    assert s.APP_ENV == "development"
    assert "secretpass123" not in s.masked_database_url
    assert "myuser:***@" in s.masked_database_url


def test_cors_origins_parsing():
    """Verify comma-separated origins are parsed properly into a list."""
    s = Settings(
        FRONTEND_ORIGINS="http://localhost:5173, https://pixeldesk.app, http://127.0.0.1:5173",
        APP_ENV="development"
    )
    assert len(s.FRONTEND_ORIGINS) == 3
    assert "https://pixeldesk.app" in s.FRONTEND_ORIGINS
    assert "http://localhost:5173" in s.FRONTEND_ORIGINS


def test_db_connectivity_timeout_resilience():
    """Verify check_db_connectivity does not raise unhandled exceptions if DB is unreachable."""
    # Running check_db_connectivity when local DB is offline returns structured failure dict
    result = asyncio.run(check_db_connectivity(timeout_seconds=0.5))
    assert isinstance(result, dict)
    assert "connected" in result
    assert "status" in result
    assert "details" in result
