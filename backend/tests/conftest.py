import os
import pytest
from fastapi.testclient import TestClient

# Force testing environment
os.environ["APP_ENV"] = "testing"
os.environ["DATABASE_URL"] = "postgresql+asyncpg://postgres:postgres@localhost:5432/pixeldesk_test"

from app.main import app


@pytest.fixture
def client():
    """Synchronous FastAPI TestClient fixture."""
    with TestClient(app=app, base_url="http://test") as c:
        yield c
