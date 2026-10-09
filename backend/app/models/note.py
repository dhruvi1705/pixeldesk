import uuid
from typing import List
from sqlalchemy import String, Text, Boolean, JSON, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Note(Base, TimestampMixin):
    """Note database model representing a PixelDesk scratchpad note."""
    __tablename__ = "notes"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True,
        default=lambda: f"note_{uuid.uuid4().hex[:12]}"
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
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    tags: Mapped[List[str]] = mapped_column(
        JSON,
        default=list,
        nullable=False
    )
    accent: Mapped[str] = mapped_column(
        String(30),
        default="lavender",
        nullable=False
    )
    pinned: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="notes")

    __table_args__ = (
        Index("ix_notes_user_pinned", "user_id", "pinned"),
    )

    def __repr__(self) -> str:
        return f"<Note id={self.id} title={self.title} pinned={self.pinned}>"
