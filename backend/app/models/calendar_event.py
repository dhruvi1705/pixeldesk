import uuid
from typing import Optional
from sqlalchemy import String, Text, Boolean, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class CalendarEvent(Base, TimestampMixin):
    """Calendar event database model representing a PixelDesk scheduled event."""
    __tablename__ = "calendar_events"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True,
        default=lambda: f"evt_{uuid.uuid4().hex[:12]}"
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
    date: Mapped[str] = mapped_column(
        String(10),  # YYYY-MM-DD
        nullable=False,
        index=True
    )
    start_time: Mapped[Optional[str]] = mapped_column(
        String(10),  # e.g., "09:00"
        nullable=True
    )
    end_time: Mapped[Optional[str]] = mapped_column(
        String(10),  # e.g., "10:30"
        nullable=True
    )
    all_day: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    category: Mapped[str] = mapped_column(
        String(50),
        default="Other",
        nullable=False
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="calendar_events")

    __table_args__ = (
        Index("ix_calendar_user_date", "user_id", "date"),
    )

    def __repr__(self) -> str:
        return f"<CalendarEvent id={self.id} title={self.title} date={self.date}>"
