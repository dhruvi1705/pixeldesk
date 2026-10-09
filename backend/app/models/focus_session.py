import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class FocusSession(Base):
    """Focus session database model representing a completed Pomodoro session."""
    __tablename__ = "focus_sessions"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True,
        default=lambda: f"sess_{uuid.uuid4().hex[:12]}"
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    task_id: Mapped[Optional[str]] = mapped_column(
        String(64),
        ForeignKey("tasks.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    task_title: Mapped[Optional[str]] = mapped_column(
        String(200),
        nullable=True
    )
    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        default=25,
        nullable=False
    )
    mode: Mapped[str] = mapped_column(
        String(30),
        default="focus",
        nullable=False
    )
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="focus_sessions")
    task: Mapped[Optional["Task"]] = relationship("Task", back_populates="focus_sessions")

    __table_args__ = (
        Index("ix_focus_user_completed_at", "user_id", "completed_at"),
    )

    def __repr__(self) -> str:
        return f"<FocusSession id={self.id} duration={self.duration_minutes}m completed_at={self.completed_at}>"
