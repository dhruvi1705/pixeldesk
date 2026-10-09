import uuid
from typing import List, Optional, Dict, Any
from sqlalchemy import String, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """User database model representing a PixelDesk account."""
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    full_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    avatar_config: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True
    )
    settings: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    # Relationships
    tasks: Mapped[List["Task"]] = relationship(
        "Task",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    notes: Mapped[List["Note"]] = relationship(
        "Note",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    calendar_events: Mapped[List["CalendarEvent"]] = relationship(
        "CalendarEvent",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    focus_sessions: Mapped[List["FocusSession"]] = relationship(
        "FocusSession",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    finance_transactions: Mapped[List["FinanceTransaction"]] = relationship(
        "FinanceTransaction",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email}>"
