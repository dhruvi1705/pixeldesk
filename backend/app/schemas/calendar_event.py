"""
Pydantic schemas for Calendar Events CRUD endpoints.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class CalendarEventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    date: str = Field(..., max_length=10, description="YYYY-MM-DD")
    start_time: Optional[str] = Field(None, max_length=10)
    end_time: Optional[str] = Field(None, max_length=10)
    all_day: bool = False
    category: str = Field("Other", max_length=50)
    description: Optional[str] = None


class CalendarEventCreate(CalendarEventBase):
    id: Optional[str] = Field(None, max_length=64)


class CalendarEventUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    date: Optional[str] = Field(None, max_length=10)
    start_time: Optional[str] = Field(None, max_length=10)
    end_time: Optional[str] = Field(None, max_length=10)
    all_day: Optional[bool] = None
    category: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None


class CalendarEventResponse(CalendarEventBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
