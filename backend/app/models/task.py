import uuid
from typing import Optional, List
from sqlalchemy import String, Text, Boolean, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Task(Base, TimestampMixin):
    """Task database model representing a PixelDesk task item."""
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True,
        default=lambda: f"task_{uuid.uuid4().hex[:12]}"
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    due_date: Mapped[Optional[str]] = mapped_column(
        String(10),  # YYYY-MM-DD
        nullable=True,
        index=True
    )
    priority: Mapped[str] = mapped_column(
        String(20),
        default="Medium",
        nullable=False
    )
    category: Mapped[str] = mapped_column(
        String(50),
        default="Other",
        nullable=False
    )
    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="tasks")
    focus_sessions: Mapped[List["FocusSession"]] = relationship(
        "FocusSession",
        back_populates="task"
    )

    __table_args__ = (
        Index("ix_tasks_user_due_date", "user_id", "due_date"),
        Index("ix_tasks_user_completed", "user_id", "completed"),
    )

    def __repr__(self) -> str:
        return f"<Task id={self.id} title={self.title} completed={self.completed}>"
