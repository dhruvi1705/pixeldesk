import uuid
from decimal import Decimal
from typing import Optional
from sqlalchemy import String, Numeric, Text, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class FinanceTransaction(Base, TimestampMixin):
    """Finance transaction database model representing an income or expense."""
    __tablename__ = "finance_transactions"

    id: Mapped[str] = mapped_column(
        String(64),
        primary_key=True,
        default=lambda: f"tx_{uuid.uuid4().hex[:12]}"
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    type: Mapped[str] = mapped_column(
        String(20),  # "income" or "expense"
        nullable=False,
        index=True
    )
    amount: Mapped[Decimal] = mapped_column(
        Numeric(precision=12, scale=2),
        nullable=False
    )
    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True
    )
    date: Mapped[str] = mapped_column(
        String(10),  # YYYY-MM-DD
        nullable=False,
        index=True
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="finance_transactions")

    __table_args__ = (
        Index("ix_finance_user_date", "user_id", "date"),
        Index("ix_finance_user_type_date", "user_id", "type", "date"),
    )

    def __repr__(self) -> str:
        return f"<FinanceTransaction id={self.id} type={self.type} amount={self.amount} date={self.date}>"
