"""
Pydantic schemas for Finance Transactions CRUD endpoints.
"""

from datetime import datetime
from decimal import Decimal
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


class FinanceTransactionBase(BaseModel):
    type: Literal["income", "expense"]
    amount: Decimal = Field(..., gt=0, decimal_places=2)
    category: str = Field(..., min_length=1, max_length=50)
    date: str = Field(..., max_length=10, description="YYYY-MM-DD")
    description: Optional[str] = None


class FinanceTransactionCreate(FinanceTransactionBase):
    id: Optional[str] = Field(None, max_length=64)


class FinanceTransactionUpdate(BaseModel):
    type: Optional[Literal["income", "expense"]] = None
    amount: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    date: Optional[str] = Field(None, max_length=10)
    description: Optional[str] = None


class FinanceTransactionResponse(FinanceTransactionBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
