"""
Pydantic schemas for Tasks CRUD endpoints.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    due_date: Optional[str] = Field(None, max_length=10, description="YYYY-MM-DD")
    priority: str = Field("Medium", max_length=20)
    category: str = Field("Other", max_length=50)
    completed: bool = False


class TaskCreate(TaskBase):
    id: Optional[str] = Field(None, max_length=64)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    due_date: Optional[str] = Field(None, max_length=10)
    priority: Optional[str] = Field(None, max_length=20)
    category: Optional[str] = Field(None, max_length=50)
    completed: Optional[bool] = None


class TaskResponse(TaskBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
