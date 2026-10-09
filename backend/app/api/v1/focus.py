"""
Focus Sessions API endpoints for PixelDesk.
Enforces strict user isolation and validates task ownership when linking tasks.
"""

from datetime import datetime, timezone
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_user
from app.db.session import get_db_session
from app.models.focus_session import FocusSession
from app.models.task import Task
from app.models.user import User
from app.schemas.focus_session import FocusSessionCreate, FocusSessionResponse

router = APIRouter()


@router.get("", response_model=List[FocusSessionResponse], summary="List completed focus sessions for current user")
async def list_focus_sessions(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(50, ge=1, le=200, description="Max sessions to return")
) -> List[FocusSessionResponse]:
    query = (
        select(FocusSession)
        .where(FocusSession.user_id == current_user.id)
        .order_by(desc(FocusSession.completed_at))
        .limit(limit)
    )
    result = await db.execute(query)
    sessions = result.scalars().all()
    return [FocusSessionResponse.model_validate(s) for s in sessions]


@router.post("", response_model=FocusSessionResponse, status_code=status.HTTP_201_CREATED, summary="Log a completed focus session")
async def log_focus_session(
    session_in: FocusSessionCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> FocusSessionResponse:
    # Validate task ownership if task_id is provided
    resolved_task_title = session_in.task_title
    if session_in.task_id:
        task_query = await db.execute(
            select(Task).where(Task.id == session_in.task_id, Task.user_id == current_user.id)
        )
        task = task_query.scalar_one_or_none()
        if not task:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Referenced task does not exist or belongs to another user"
            )
        resolved_task_title = task.title

    new_session = FocusSession(
        user_id=current_user.id,
        task_id=session_in.task_id,
        task_title=resolved_task_title,
        duration_minutes=session_in.duration_minutes,
        mode=session_in.mode,
        completed_at=session_in.completed_at or datetime.now(timezone.utc)
    )
    if session_in.id:
        new_session.id = session_in.id

    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    return FocusSessionResponse.model_validate(new_session)


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a focus session record")
async def delete_focus_session(
    session_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> None:
    result = await db.execute(
        select(FocusSession).where(
            FocusSession.id == session_id,
            FocusSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Focus session not found")

    await db.delete(session)
    await db.commit()
