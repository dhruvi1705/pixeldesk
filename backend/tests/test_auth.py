"""
Unit and integration tests for PixelDesk authentication & password strength policy.
Tests password hashing, bcrypt byte limits, complexity rules (uppercase, lowercase, digit, special),
weak password deny-list, JWT claims, signup validation, login compatibility, and route protection.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock
import jwt
import pytest
from app.api.deps import get_db_session
from app.core.config import settings
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    validate_password_policy,
    verify_password,
)
from app.main import app
from app.models.user import User


# ==============================================================================
# 1. Cryptography & Password Policy Unit Tests
# ==============================================================================

def test_valid_password_meeting_all_criteria():
    """Verify passwords meeting length, uppercase, lowercase, digit, and special char are valid."""
    valid_passwords = [
        "Secret123!",
        "Pixel#2026",
        "P@ssw0rd99",
        "RetroDesk_2026!",
        " my Secret 123 ! ",  # preserves spaces
        "PixelDesk2026!✨"     # unicode symbol included
    ]
    for pw in valid_passwords:
        assert validate_password_policy(pw) == pw
        hashed = hash_password(pw)
        assert verify_password(pw, hashed) is True


def test_password_hashing_and_verification():
    """Verify bcrypt hashes passwords uniquely with salt and verifies correctly."""
    pw = "SuperSecret123!"
    hashed = hash_password(pw)

    assert hashed != pw
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$")
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword123!", hashed) is False
    assert verify_password("", hashed) is False


def test_password_below_8_characters_rejected():
    """Verify passwords shorter than 8 characters are rejected."""
    for short_pw in ["a", "1234567", "Sh0rt!", "aB1!"]:
        with pytest.raises(ValueError, match="at least 8 characters"):
            validate_password_policy(short_pw)


def test_password_missing_uppercase_rejected():
    """Verify passwords missing an uppercase letter are rejected."""
    for pw in ["secret123!", "retro_desk99#", "lowercase1@"]:
        with pytest.raises(ValueError, match="uppercase letter"):
            validate_password_policy(pw)


def test_password_missing_lowercase_rejected():
    """Verify passwords missing a lowercase letter are rejected."""
    for pw in ["SECRET123!", "RETRO_DESK99#", "UPPERCASE1@"]:
        with pytest.raises(ValueError, match="lowercase letter"):
            validate_password_policy(pw)


def test_password_missing_digits_rejected():
    """Verify passwords missing a numeric digit are rejected."""
    for pw in ["SecretPass!", "RetroDesk#", "NoNumbersHere!"]:
        with pytest.raises(ValueError, match="digit"):
            validate_password_policy(pw)


def test_password_missing_special_character_rejected():
    """Verify passwords missing a special character are rejected."""
    for pw in ["SecretPass123", "RetroDesk2026", "Password99"]:
        with pytest.raises(ValueError, match="special character"):
            validate_password_policy(pw)


def test_password_exactly_8_characters_accepted():
    """Verify a valid 8-character password meeting all criteria is accepted."""
    valid_8 = "Secr123!"
    assert validate_password_policy(valid_8) == valid_8
    hashed = hash_password(valid_8)
    assert verify_password(valid_8, hashed) is True


def test_password_exactly_72_bytes_accepted():
    """Verify passwords up to bcrypt's 72-byte limit are accepted and hashed."""
    # 68 ASCII chars + "Ab1!" = 72 bytes
    pw_72 = "a" * 68 + "Ab1!"
    assert validate_password_policy(pw_72) == pw_72
    hashed = hash_password(pw_72)
    assert verify_password(pw_72, hashed) is True


def test_password_exceeding_72_bytes_rejected():
    """Verify passwords exceeding 72 bytes are rejected rather than silently truncated."""
    long_pw = "a" * 69 + "Ab1!"  # 73 bytes
    with pytest.raises(ValueError, match="72 bytes"):
        validate_password_policy(long_pw)


def test_password_multibyte_unicode_exceeding_72_bytes_rejected():
    """Verify multibyte Unicode passwords exceeding 72 bytes in UTF-8 are rejected."""
    # "Ab1!" (4 bytes) + 20 fire emojis (20 * 4 = 80 bytes) = 84 bytes (> 72)
    unicode_long = "Ab1!" + "🔥" * 20
    with pytest.raises(ValueError, match="72 bytes"):
        validate_password_policy(unicode_long)


def test_password_exceeding_128_characters_rejected():
    """Verify passwords exceeding 128 characters are rejected."""
    very_long = "Ab1!" + "a" * 130
    with pytest.raises(ValueError):
        validate_password_policy(very_long)


def test_password_whitespace_only_rejected():
    """Verify whitespace-only passwords of any length are rejected."""
    for ws in ["        ", "\t\t\t\t\t\t\t\t", "   \n   \t  "]:
        with pytest.raises(ValueError, match="whitespace"):
            validate_password_policy(ws)


def test_password_with_spaces_and_special_chars_preserved():
    """Verify spaces and special characters are preserved exactly without trimming."""
    passphrase = " My Secr3t Pass 123 ! "
    assert validate_password_policy(passphrase) == passphrase
    hashed = hash_password(passphrase)
    assert verify_password(passphrase, hashed) is True
    # Trimming should NOT match
    assert verify_password(passphrase.strip(), hashed) is False


def test_password_weak_and_common_rejected():
    """Verify common or easily guessed passwords from the deny-list are rejected."""
    weak_candidates = [
        "password",
        "password123",
        "password123!",
        "12345678",
        "admin123!",
        "pixeldesk123!",
        "welcome123!",
        "iloveyou123!",
    ]
    for weak in weak_candidates:
        with pytest.raises(ValueError):
            validate_password_policy(weak)


def test_password_single_character_repeat_rejected():
    """Verify trivial single-character repeat passwords are rejected."""
    for rep in ["aaaaaaaa", "11111111", "........"]:
        with pytest.raises(ValueError):
            validate_password_policy(rep)


def test_jwt_token_generation_and_decoding():
    """Verify JWT access tokens encode and decode claims faithfully."""
    user_id = "usr_test123"
    email = "test@pixeldesk.dev"
    token = create_access_token(subject=user_id, email=email)

    payload = decode_access_token(token)
    assert payload["sub"] == user_id
    assert payload["email"] == email
    assert payload["iss"] == settings.APP_NAME
    assert "exp" in payload
    assert "iat" in payload


def test_jwt_token_expiration():
    """Verify expired tokens raise ExpiredSignatureError on decode."""
    expired_token = create_access_token(
        subject="usr_expired",
        expires_delta=timedelta(seconds=-10)
    )
    with pytest.raises(jwt.ExpiredSignatureError):
        decode_access_token(expired_token)


def test_jwt_token_tampering():
    """Verify tampered tokens are rejected with PyJWTError."""
    token = create_access_token(subject="usr_valid")
    tampered_token = token[:-5] + "xxxxx"
    with pytest.raises(jwt.PyJWTError):
        decode_access_token(tampered_token)


# ==============================================================================
# 2. FastAPI Endpoint Authentication Tests
# ==============================================================================

class MockAsyncSession:
    """Mock async database session for isolated endpoint testing."""
    def __init__(self, users=None):
        self.users = users or {}
        self.added = []
        self.committed = False

    async def execute(self, statement):
        mock_result = MagicMock()
        stmt_str = str(statement)

        if "lower(users.email)" in stmt_str or "users.email" in stmt_str:
            target_user = None
            for u in self.users.values():
                target_user = u
                break
            mock_result.scalar_one_or_none.return_value = target_user
        elif "users.id" in stmt_str:
            target_user = next(iter(self.users.values()), None)
            mock_result.scalar_one_or_none.return_value = target_user
        else:
            mock_result.scalar_one_or_none.return_value = None

        return mock_result

    def add(self, instance):
        self.added.append(instance)

    async def commit(self):
        self.committed = True

    async def refresh(self, instance):
        if not instance.id:
            instance.id = "usr_mock_generated"
        if not instance.created_at:
            instance.created_at = datetime.now(timezone.utc)
        if not instance.updated_at:
            instance.updated_at = datetime.now(timezone.utc)


def test_signup_success(client):
    """Test successful user registration endpoint with compliant strong password."""
    mock_db = MockAsyncSession(users={})

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "email": "newuser@pixeldesk.dev",
                "password": "ValidPassword123!",
                "full_name": "Pixel Adventurer"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "newuser@pixeldesk.dev"
        assert data["user"]["full_name"] == "Pixel Adventurer"
    finally:
        app.dependency_overrides.clear()


def test_signup_duplicate_email(client):
    """Test registration rejection when email already exists."""
    existing_user = User(
        id="usr_existing",
        email="existing@pixeldesk.dev",
        hashed_password=hash_password("Pass1234!"),
        full_name="Existing User",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    mock_db = MockAsyncSession(users={"existing@pixeldesk.dev": existing_user})

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "email": "existing@pixeldesk.dev",
                "password": "Password1234!",
                "full_name": "Duplicate User"
            }
        )
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]
    finally:
        app.dependency_overrides.clear()


def test_signup_validation_errors(client):
    """Test registration validation for invalid email, short, weak, and non-compliant passwords."""
    # Invalid email
    res1 = client.post(
        "/api/v1/auth/signup",
        json={"email": "invalid-email-format", "password": "ValidPassword123!"}
    )
    assert res1.status_code == 422

    # Short password (<8 chars)
    res2 = client.post(
        "/api/v1/auth/signup",
        json={"email": "valid@pixeldesk.dev", "password": "Sh0rt!"}
    )
    assert res2.status_code == 422
    assert "at least 8 characters" in str(res2.json())

    # Missing uppercase
    res3 = client.post(
        "/api/v1/auth/signup",
        json={"email": "valid@pixeldesk.dev", "password": "password123!"}
    )
    assert res3.status_code == 422
    assert "uppercase" in str(res3.json())

    # Missing special character
    res4 = client.post(
        "/api/v1/auth/signup",
        json={"email": "valid@pixeldesk.dev", "password": "Password123"}
    )
    assert res4.status_code == 422
    assert "special character" in str(res4.json())

    # Whitespace only
    res5 = client.post(
        "/api/v1/auth/signup",
        json={"email": "valid@pixeldesk.dev", "password": "        "}
    )
    assert res5.status_code == 422
    assert "whitespace" in str(res5.json())


def test_login_success(client):
    """Test successful login returns access token and user info."""
    raw_password = "ValidPassword123!"
    test_user = User(
        id="usr_login_123",
        email="login@pixeldesk.dev",
        hashed_password=hash_password(raw_password),
        full_name="Pixel Hero",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    mock_db = MockAsyncSession(users={"login@pixeldesk.dev": test_user})

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "login@pixeldesk.dev",
                "password": raw_password
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == "login@pixeldesk.dev"
        assert data["user"]["id"] == "usr_login_123"
    finally:
        app.dependency_overrides.clear()


def test_login_compatibility_with_legacy_account(client):
    """Test login is compatible with existing accounts without retroactively applying signup password rules."""
    # Existing account with a legacy simple password (e.g. 6 chars, no special char)
    legacy_pw = "old123"
    test_user = User(
        id="usr_legacy_123",
        email="legacy@pixeldesk.dev",
        hashed_password="",
        full_name="Legacy User",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    import bcrypt
    test_user.hashed_password = bcrypt.hashpw(legacy_pw.encode("utf-8"), bcrypt.gensalt(10)).decode("utf-8")

    mock_db = MockAsyncSession(users={"legacy@pixeldesk.dev": test_user})

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "legacy@pixeldesk.dev",
                "password": legacy_pw
            }
        )
        assert response.status_code == 200
        assert response.json()["user"]["email"] == "legacy@pixeldesk.dev"
    finally:
        app.dependency_overrides.clear()


def test_login_invalid_password(client):
    """Test login failure with incorrect password."""
    test_user = User(
        id="usr_login_fail",
        email="login@pixeldesk.dev",
        hashed_password=hash_password("CorrectPassword123!"),
        full_name="Pixel Hero",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    mock_db = MockAsyncSession(users={"login@pixeldesk.dev": test_user})

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "login@pixeldesk.dev",
                "password": "WrongPassword123!"
            }
        )
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]
    finally:
        app.dependency_overrides.clear()


def test_get_current_user_me_endpoint(client):
    """Test GET /api/v1/auth/me with valid Bearer token."""
    test_user = User(
        id="usr_me_123",
        email="me@pixeldesk.dev",
        hashed_password=hash_password("SecretPass123!"),
        full_name="Current User",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    mock_db = MockAsyncSession(users={"usr_me_123": test_user})
    token = create_access_token(subject="usr_me_123", email="me@pixeldesk.dev")

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "usr_me_123"
        assert data["email"] == "me@pixeldesk.dev"
        assert data["full_name"] == "Current User"
    finally:
        app.dependency_overrides.clear()


def test_protected_route_without_token(client):
    """Test accessing /api/v1/auth/me without authorization header yields 401."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert "credentials were not provided" in response.json()["detail"]


def test_protected_route_with_expired_token(client):
    """Test accessing /api/v1/auth/me with expired token yields 401."""
    expired_token = create_access_token(
        subject="usr_expired",
        expires_delta=timedelta(seconds=-10)
    )
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401
    assert "token has expired" in response.json()["detail"]


# ==============================================================================
# 3. Session Restoration & Account Switching Tests
# ==============================================================================

def test_refresh_restoration_with_valid_session(client):
    """Test session restoration on refresh when holding valid JWT token."""
    user = User(
        id="usr_refresh_hero",
        email="hero@pixeldesk.dev",
        hashed_password=hash_password("HeroPass123!"),
        full_name="Hero Refresh",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    mock_db = MockAsyncSession(users={"usr_refresh_hero": user})
    token = create_access_token(subject="usr_refresh_hero", email="hero@pixeldesk.dev")

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "usr_refresh_hero"
        assert data["email"] == "hero@pixeldesk.dev"
    finally:
        app.dependency_overrides.clear()


def test_account_switching_token_isolation(client):
    """Test that switching user tokens resolves distinct user profiles."""
    user_a = User(
        id="usr_account_a",
        email="a@pixeldesk.dev",
        hashed_password=hash_password("PassA1234!"),
        full_name="User Alpha",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    user_b = User(
        id="usr_account_b",
        email="b@pixeldesk.dev",
        hashed_password=hash_password("PassB1234!"),
        full_name="User Beta",
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    token_a = create_access_token(subject="usr_account_a", email="a@pixeldesk.dev")
    token_b = create_access_token(subject="usr_account_b", email="b@pixeldesk.dev")

    class MultiUserSession:
        def __init__(self):
            self.users = {"usr_account_a": user_a, "usr_account_b": user_b}

        async def execute(self, statement):
            mock = MagicMock()
            params = {}
            try:
                params = statement.compile().params
            except Exception:
                pass
            uid = None
            for k, v in params.items():
                if "id" in k or "user_id" in k:
                    uid = v
                    break
            mock.scalar_one_or_none.return_value = self.users.get(uid)
            return mock

    async def override_get_db():
        yield MultiUserSession()

    app.dependency_overrides[get_db_session] = override_get_db
    try:
        # Request with Token A
        res_a = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token_a}"})
        assert res_a.status_code == 200
        assert res_a.json()["id"] == "usr_account_a"
        assert res_a.json()["email"] == "a@pixeldesk.dev"

        # Request with Token B (Account Switch)
        res_b = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token_b}"})
        assert res_b.status_code == 200
        assert res_b.json()["id"] == "usr_account_b"
        assert res_b.json()["email"] == "b@pixeldesk.dev"
    finally:
        app.dependency_overrides.clear()
