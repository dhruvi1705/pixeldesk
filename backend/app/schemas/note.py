"""
Pydantic schemas for Notes CRUD endpoints.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str
    tags: List[str] = Field(default_factory=list)
    accent: str = Field("lavender", max_length=30)
    pinned: bool = False


class NoteCreate(NoteBase):
    id: Optional[str] = Field(None, max_length=64)


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    accent: Optional[str] = Field(None, max_length=30)
    pinned: Optional[bool] = None


class NoteResponse(NoteBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
