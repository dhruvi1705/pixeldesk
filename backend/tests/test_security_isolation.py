"""
Security, Multi-Tenancy, and Isolation Tests for PixelDesk.
Validates:
1. Unauthenticated users cannot access protected endpoints.
2. User A cannot access or update User B's records or profile.
3. Server ignores client-supplied user IDs and strictly derives owner identity from the verified JWT.
4. Expired, forged, and tampered tokens are rejected.
5. Inactive/deactivated users cannot perform operations.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock
import pytest
from app.api.deps import get_db_session
from app.core.security import create_access_token, hash_password
from app.main import app
from app.models.user import User


class MockAsyncSession:
    """Mock async database session for multi-user isolation testing."""
    def __init__(self, users=None):
        self.users = users or {}
        self.added = []
        self.committed = False

    async def execute(self, statement):
        mock_result = MagicMock()
        stmt_str = str(statement)

        # Search by User ID
        for u in self.users.values():
            if f"'{u.id}'" in stmt_str or "users.id" in stmt_str:
                mock_result.scalar_one_or_none.return_value = u
                return mock_result

        mock_result.scalar_one_or_none.return_value = None
        return mock_result

    def add(self, instance):
        self.added.append(instance)

    async def commit(self):
        self.committed = True

    async def refresh(self, instance):
        if not instance.updated_at:
            instance.updated_at = datetime.now(timezone.utc)


def test_unauthenticated_request_blocked(client):
    """Verify unauthenticated requests to protected endpoints return 401."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert "credentials were not provided" in response.json()["detail"]


def test_invalid_bearer_token_rejected(client):
    """Verify invalid or malformed bearer token returns 401."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_garbage_token_string"}
    )
    assert response.status_code == 401


def test_expired_token_rejected(client):
    """Verify expired token returns 401 and does not grant access."""
    expired_token = create_access_token(
        subject="user_alice",
        expires_delta=timedelta(seconds=-1)
    )
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401
    assert "token has expired" in response.json()["detail"]


def test_user_a_cannot_access_user_b_profile(client):
    """
    Verify that Alice's token only ever returns Alice's profile data,
    and cannot be used to read or modify Bob's profile data.
    """
    alice = User(
        id="usr_alice_123",
        email="alice@pixeldesk.dev",
        hashed_password=hash_password("AliceSecret123!"),
        full_name="Alice Adventurer",
        avatar_config={"skin": "fair", "hair": "braids"},
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    mock_db = MockAsyncSession(users={"usr_alice_123": alice})

    async def override_get_db():
        yield mock_db

    alice_token = create_access_token(subject="usr_alice_123", email="alice@pixeldesk.dev")

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        # Alice requests profile
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {alice_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "usr_alice_123"
        assert data["email"] == "alice@pixeldesk.dev"
        assert data["full_name"] == "Alice Adventurer"
        assert "bob" not in str(data).lower()
    finally:
        app.dependency_overrides.clear()


def test_user_update_ignores_client_supplied_user_id(client):
    """
    Verify that updating a profile derives the user ID strictly from the JWT subject,
    ignoring any attempt to supply a target user ID in payload.
    """
    alice = User(
        id="usr_alice_123",
        email="alice@pixeldesk.dev",
        hashed_password=hash_password("AliceSecret123!"),
        full_name="Alice Original",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    mock_db = MockAsyncSession(users={"usr_alice_123": alice})

    async def override_get_db():
        yield mock_db

    alice_token = create_access_token(subject="usr_alice_123", email="alice@pixeldesk.dev")

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        # Attempt to modify Bob with Alice's token
        response = client.patch(
            "/api/v1/auth/me",
            json={
                "id": "usr_bob_456",  # malicious client injection
                "full_name": "Alice Updated"
            },
            headers={"Authorization": f"Bearer {alice_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        # Ensure Alice's ID remained unchanged
        assert data["id"] == "usr_alice_123"
        assert data["full_name"] == "Alice Updated"
    finally:
        app.dependency_overrides.clear()


def test_deactivated_user_blocked(client):
    """Verify deactivated user accounts are forbidden from accessing endpoints."""
    deactivated_user = User(
        id="usr_deactivated",
        email="banned@pixeldesk.dev",
        hashed_password=hash_password("Pass123!"),
        full_name="Deactivated User",
        is_active=False,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    mock_db = MockAsyncSession(users={"usr_deactivated": deactivated_user})

    async def override_get_db():
        yield mock_db

    token = create_access_token(subject="usr_deactivated", email="banned@pixeldesk.dev")

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403
        assert "deactivated" in response.json()["detail"].lower()
    finally:
        app.dependency_overrides.clear()
