"""
Notes CRUD API endpoints for PixelDesk.
Enforces strict user isolation: all operations are scoped to current_user.id.
"""

from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_user
from app.db.session import get_db_session
from app.models.note import Note
from app.models.user import User
from app.schemas.note import NoteCreate, NoteResponse, NoteUpdate

router = APIRouter()


@router.get("", response_model=List[NoteResponse], summary="List all notes for current user")
async def list_notes(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    pinned: Optional[bool] = Query(None, description="Filter by pinned status")
) -> List[NoteResponse]:
    query = select(Note).where(Note.user_id == current_user.id)
    if pinned is not None:
        query = query.where(Note.pinned == pinned)
    query = query.order_by(desc(Note.pinned), desc(Note.updated_at))

    result = await db.execute(query)
    notes = result.scalars().all()
    return [NoteResponse.model_validate(n) for n in notes]


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED, summary="Create a new note")
async def create_note(
    note_in: NoteCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> NoteResponse:
    new_note = Note(
        user_id=current_user.id,
        title=note_in.title,
        content=note_in.content,
        tags=note_in.tags,
        accent=note_in.accent,
        pinned=note_in.pinned
    )
    if note_in.id:
        new_note.id = note_in.id

    db.add(new_note)
    await db.commit()
    await db.refresh(new_note)
    return NoteResponse.model_validate(new_note)


@router.get("/{note_id}", response_model=NoteResponse, summary="Get single note by ID")
async def get_note(
    note_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> NoteResponse:
    result = await db.execute(
        select(Note).where(Note.id == note_id, Note.user_id == current_user.id)
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return NoteResponse.model_validate(note)


@router.patch("/{note_id}", response_model=NoteResponse, summary="Update an existing note")
async def update_note(
    note_id: str,
    note_in: NoteUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> NoteResponse:
    result = await db.execute(
        select(Note).where(Note.id == note_id, Note.user_id == current_user.id)
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    if note_in.title is not None:
        note.title = note_in.title
    if note_in.content is not None:
        note.content = note_in.content
    if note_in.tags is not None:
        note.tags = note_in.tags
    if note_in.accent is not None:
        note.accent = note_in.accent
    if note_in.pinned is not None:
        note.pinned = note_in.pinned

    db.add(note)
    await db.commit()
    await db.refresh(note)
    return NoteResponse.model_validate(note)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a note")
async def delete_note(
    note_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> None:
    result = await db.execute(
        select(Note).where(Note.id == note_id, Note.user_id == current_user.id)
    )
    note = result.scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    await db.delete(note)
    await db.commit()
