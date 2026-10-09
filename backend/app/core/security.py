"""
Security and cryptography utilities for PixelDesk.
Provides password validation, bcrypt hashing, and JWT token generation/validation via PyJWT.
"""

from datetime import datetime, timedelta, timezone
import re
from typing import Any, Dict, Optional, Set, Union
import bcrypt
import jwt
from app.core.config import settings

# Curated set of common, easily guessed weak passwords
COMMON_WEAK_PASSWORDS: Set[str] = {
    "password",
    "password1",
    "password123",
    "password123!",
    "12345678",
    "123456789",
    "1234567890",
    "87654321",
    "qwertyui",
    "qwerty123",
    "admin123",
    "admin123!",
    "administrator",
    "letmein123",
    "letmein123!",
    "pixeldesk",
    "pixeldesk123",
    "pixeldesk123!",
    "welcome1",
    "welcome123",
    "welcome123!",
    "iloveyou",
    "iloveyou123!",
    "sunshine1",
    "princess1",
    "football1",
    "monkey123",
    "changeme",
    "changeme123",
    "passphrase",
    "master123",
    "p@ssw0rd123!",
}


def validate_password_policy(password: str) -> str:
    """
    Validate a password against PixelDesk's strength policy:
    1. Minimum length: 8 characters.
    2. Maximum length: 128 characters.
    3. At least one uppercase letter (A-Z).
    4. At least one lowercase letter (a-z).
    5. At least one digit (0-9).
    6. At least one special character (e.g. @, #, $, %, !, &, etc.).
    7. Reject passwords containing solely whitespace.
    8. Maximum byte length: 72 UTF-8 bytes (bcrypt native input ceiling).
    9. Reject common, easily guessed, or trivial single-character repeat passwords.
    10. Preserves valid characters exactly without trimming or altering whitespace.
    """
    if not isinstance(password, str):
        raise ValueError("Password must be a string.")

    if not password.strip():
        raise ValueError("Password cannot consist solely of whitespace.")

    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long.")

    if len(password) > 128:
        raise ValueError("Password cannot exceed 128 characters.")

    # Bcrypt processes up to 72 bytes. Reject exceeding byte-length to prevent silent truncation.
    encoded_bytes = password.encode("utf-8")
    if len(encoded_bytes) > 72:
        raise ValueError("Password exceeds maximum supported length of 72 bytes for secure hashing.")

    # Complexity: at least one uppercase letter
    if not any(c.isupper() for c in password):
        raise ValueError("Password must contain at least one uppercase letter (A-Z).")

    # Complexity: at least one lowercase letter
    if not any(c.islower() for c in password):
        raise ValueError("Password must contain at least one lowercase letter (a-z).")

    # Complexity: at least one digit
    if not any(c.isdigit() for c in password):
        raise ValueError("Password must contain at least one digit (0-9).")

    # Complexity: at least one special character (punctuation / non-alphanumeric and non-space)
    if not any(not c.isalnum() and not c.isspace() for c in password):
        raise ValueError("Password must contain at least one special character (e.g. !, @, #, $, %, &, *).")

    # Check for common weak passwords (case-insensitive check)
    if password.lower() in COMMON_WEAK_PASSWORDS:
        raise ValueError("Password is too common or easily guessed. Please choose a stronger password.")

    # Check for trivial single-character repeats (e.g. "aaaaaaaa", "11111111")
    if len(set(password)) == 1:
        raise ValueError("Password cannot consist of a single repeated character.")

    return password


def hash_password(password: str) -> str:
    """
    Securely hash a plaintext password using bcrypt with a generated salt.
    Enforces password validation policy and rejects passwords exceeding bcrypt's 72-byte limit.
    """
    validate_password_policy(password)
    encoded = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed_bytes = bcrypt.hashpw(encoded, salt)
    return hashed_bytes.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a stored bcrypt hash in constant time.
    Gracefully handles edge cases without raising unhandled errors to maintain login compatibility.
    """
    try:
        encoded_plain = plain_password.encode("utf-8")
        if len(encoded_plain) > 72:
            return False
        return bcrypt.checkpw(
            encoded_plain,
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def create_access_token(
    subject: Union[str, Any],
    email: Optional[str] = None,
    expires_delta: Optional[timedelta] = None,
    extra_claims: Optional[Dict[str, Any]] = None
) -> str:
    """
    Generate a signed JSON Web Token (JWT) with standard and custom claims.
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "iat": int(now.timestamp()),
        "nbf": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": settings.APP_NAME,
    }

    if email:
        to_encode["email"] = email

    if extra_claims:
        to_encode.update(extra_claims)

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode, verify signature, and validate claims of an access token.
    Raises jwt.PyJWTError on failure.
    """
    payload = jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=[settings.JWT_ALGORITHM],
        options={
            "verify_signature": True,
            "verify_exp": True,
            "verify_nbf": True,
            "verify_iat": True,
            "require": ["sub", "exp"]
        }
    )
    return payload
