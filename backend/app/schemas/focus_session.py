"""
Pydantic schemas for Focus Sessions CRUD endpoints.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class FocusSessionCreate(BaseModel):
    id: Optional[str] = Field(None, max_length=64)
    task_id: Optional[str] = Field(None, max_length=64)
    task_title: Optional[str] = Field(None, max_length=200)
    duration_minutes: int = Field(25, ge=1, le=240)
    mode: str = Field("focus", max_length=30)
    completed_at: Optional[datetime] = None


class FocusSessionResponse(BaseModel):
    id: str
    user_id: str
    task_id: Optional[str] = None
    task_title: Optional[str] = None
    duration_minutes: int
    mode: str
    completed_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
