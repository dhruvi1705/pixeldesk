"""
Calendar Events CRUD API endpoints for PixelDesk.
Enforces strict user isolation: all operations are scoped to current_user.id.
"""

from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import asc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_user
from app.db.session import get_db_session
from app.models.calendar_event import CalendarEvent
from app.models.user import User
from app.schemas.calendar_event import (
    CalendarEventCreate,
    CalendarEventResponse,
    CalendarEventUpdate,
)

router = APIRouter()


@router.get("", response_model=List[CalendarEventResponse], summary="List calendar events for current user")
async def list_calendar_events(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    date: Optional[str] = Query(None, description="Filter by YYYY-MM-DD"),
    month: Optional[str] = Query(None, description="Filter by YYYY-MM prefix")
) -> List[CalendarEventResponse]:
    query = select(CalendarEvent).where(CalendarEvent.user_id == current_user.id)
    if date:
        query = query.where(CalendarEvent.date == date)
    elif month:
        query = query.where(CalendarEvent.date.startswith(month))
    query = query.order_by(asc(CalendarEvent.date), asc(CalendarEvent.start_time))

    result = await db.execute(query)
    events = result.scalars().all()
    return [CalendarEventResponse.model_validate(e) for e in events]


@router.post("", response_model=CalendarEventResponse, status_code=status.HTTP_201_CREATED, summary="Create a new calendar event")
async def create_calendar_event(
    event_in: CalendarEventCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> CalendarEventResponse:
    new_event = CalendarEvent(
        user_id=current_user.id,
        title=event_in.title,
        date=event_in.date,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        all_day=event_in.all_day,
        category=event_in.category,
        description=event_in.description
    )
    if event_in.id:
        new_event.id = event_in.id

    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    return CalendarEventResponse.model_validate(new_event)


@router.get("/{event_id}", response_model=CalendarEventResponse, summary="Get single calendar event by ID")
async def get_calendar_event(
    event_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> CalendarEventResponse:
    result = await db.execute(
        select(CalendarEvent).where(
            CalendarEvent.id == event_id,
            CalendarEvent.user_id == current_user.id
        )
    )
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calendar event not found")
    return CalendarEventResponse.model_validate(event)


@router.patch("/{event_id}", response_model=CalendarEventResponse, summary="Update an existing calendar event")
async def update_calendar_event(
    event_id: str,
    event_in: CalendarEventUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> CalendarEventResponse:
    result = await db.execute(
        select(CalendarEvent).where(
            CalendarEvent.id == event_id,
            CalendarEvent.user_id == current_user.id
        )
    )
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calendar event not found")

    if event_in.title is not None:
        event.title = event_in.title
    if event_in.date is not None:
        event.date = event_in.date
    if event_in.start_time is not None:
        event.start_time = event_in.start_time
    if event_in.end_time is not None:
        event.end_time = event_in.end_time
    if event_in.all_day is not None:
        event.all_day = event_in.all_day
    if event_in.category is not None:
        event.category = event_in.category
    if event_in.description is not None:
        event.description = event_in.description

    db.add(event)
    await db.commit()
    await db.refresh(event)
    return CalendarEventResponse.model_validate(event)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a calendar event")
async def delete_calendar_event(
    event_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> None:
    result = await db.execute(
        select(CalendarEvent).where(
            CalendarEvent.id == event_id,
            CalendarEvent.user_id == current_user.id
        )
    )
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Calendar event not found")

    await db.delete(event)
    await db.commit()
