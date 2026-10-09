"""
User schemas for registration, login, profile reading, and updates.
"""

from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from app.core.security import validate_password_policy


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)


class UserCreate(UserBase):
    password: str = Field(..., description="Plaintext user password conforming to password policy")
    avatar_config: Optional[Dict[str, Any]] = None
    settings: Optional[Dict[str, Any]] = None

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        return validate_password_policy(v)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    avatar_config: Optional[Dict[str, Any]] = None
    settings: Optional[Dict[str, Any]] = None
    password: Optional[str] = Field(None, description="Optional new password for user")

    @field_validator("password")
    @classmethod
    def validate_password_update(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return validate_password_policy(v)
        return v


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    avatar_config: Optional[Dict[str, Any]] = None
    settings: Optional[Dict[str, Any]] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
