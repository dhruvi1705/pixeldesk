"""
Authentication and User Account API endpoints for PixelDesk.
Includes registration, login, authenticated user profile (/me), and profile updates.
"""

import logging
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserUpdate

logger = logging.getLogger("pixeldesk.auth")

router = APIRouter()


@router.post(
    "/signup",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account"
)
async def signup(
    user_in: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> Token:
    """
    Create a new user account with hashed password and return an initial access token.
    Rejects duplicate email registrations with a clean 400 error.
    """
    # 1. Check for existing user with identical email (case-insensitive)
    existing_user_query = await db.execute(
        select(User).where(func.lower(User.email) == user_in.email.lower())
    )
    if existing_user_query.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )

    # 2. Hash password securely
    hashed_pw = hash_password(user_in.password)

    # 3. Create user record
    new_user = User(
        email=user_in.email.lower(),
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        avatar_config=user_in.avatar_config,
        settings=user_in.settings,
        is_active=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    logger.info("New user registered successfully with ID: %s", new_user.id)

    # 4. Generate JWT access token
    access_token = create_access_token(subject=new_user.id, email=new_user.email)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and obtain access token"
)
async def login(
    credentials: UserLogin,
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> Token:
    """
    Authenticate user using email and password, returning a signed JWT access token.
    Uses constant-time password verification to mitigate timing attacks.
    """
    # 1. Fetch user by email
    query = await db.execute(
        select(User).where(func.lower(User.email) == credentials.email.lower())
    )
    user = query.scalar_one_or_none()

    # 2. Verify existence and password
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # 3. Check active status
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )

    # 4. Generate access token
    access_token = create_access_token(subject=user.id, email=user.email)

    logger.info("User logged in successfully: %s", user.id)

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user profile"
)
async def get_current_user_profile(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> UserResponse:
    """
    Return the profile data for the currently authenticated user.
    """
    return UserResponse.model_validate(current_user)


@router.patch(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update current authenticated user profile"
)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> UserResponse:
    """
    Update profile fields, avatar configuration, preferences, or password for the current user.
    """
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name

    if user_update.avatar_config is not None:
        current_user.avatar_config = user_update.avatar_config

    if user_update.settings is not None:
        current_user.settings = user_update.settings

    if user_update.password is not None:
        current_user.hashed_password = hash_password(user_update.password)

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return UserResponse.model_validate(current_user)
