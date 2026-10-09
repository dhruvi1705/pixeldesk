"""
Finance Transactions CRUD API endpoints for PixelDesk.
Enforces strict user isolation and fixed decimal precision arithmetic.
"""

from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_user
from app.db.session import get_db_session
from app.models.finance_transaction import FinanceTransaction
from app.models.user import User
from app.schemas.finance_transaction import (
    FinanceTransactionCreate,
    FinanceTransactionResponse,
    FinanceTransactionUpdate,
)

router = APIRouter()


@router.get("", response_model=List[FinanceTransactionResponse], summary="List finance transactions for current user")
async def list_finance_transactions(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    month: Optional[str] = Query(None, description="Filter by YYYY-MM"),
    type: Optional[str] = Query(None, description="Filter by income or expense"),
    category: Optional[str] = Query(None, description="Filter by category")
) -> List[FinanceTransactionResponse]:
    query = select(FinanceTransaction).where(FinanceTransaction.user_id == current_user.id)
    if month:
        query = query.where(FinanceTransaction.date.startswith(month))
    if type:
        query = query.where(FinanceTransaction.type == type)
    if category:
        query = query.where(FinanceTransaction.category == category)
    query = query.order_by(desc(FinanceTransaction.date), desc(FinanceTransaction.created_at))

    result = await db.execute(query)
    txs = result.scalars().all()
    return [FinanceTransactionResponse.model_validate(t) for t in txs]


@router.post("", response_model=FinanceTransactionResponse, status_code=status.HTTP_201_CREATED, summary="Create a new finance transaction")
async def create_finance_transaction(
    tx_in: FinanceTransactionCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> FinanceTransactionResponse:
    new_tx = FinanceTransaction(
        user_id=current_user.id,
        type=tx_in.type,
        amount=tx_in.amount,
        category=tx_in.category,
        date=tx_in.date,
        description=tx_in.description
    )
    if tx_in.id:
        new_tx.id = tx_in.id

    db.add(new_tx)
    await db.commit()
    await db.refresh(new_tx)
    return FinanceTransactionResponse.model_validate(new_tx)


@router.get("/{tx_id}", response_model=FinanceTransactionResponse, summary="Get single finance transaction by ID")
async def get_finance_transaction(
    tx_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> FinanceTransactionResponse:
    result = await db.execute(
        select(FinanceTransaction).where(
            FinanceTransaction.id == tx_id,
            FinanceTransaction.user_id == current_user.id
        )
    )
    tx = result.scalar_one_or_none()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return FinanceTransactionResponse.model_validate(tx)


@router.patch("/{tx_id}", response_model=FinanceTransactionResponse, summary="Update an existing finance transaction")
async def update_finance_transaction(
    tx_id: str,
    tx_in: FinanceTransactionUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> FinanceTransactionResponse:
    result = await db.execute(
        select(FinanceTransaction).where(
            FinanceTransaction.id == tx_id,
            FinanceTransaction.user_id == current_user.id
        )
    )
    tx = result.scalar_one_or_none()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    if tx_in.type is not None:
        tx.type = tx_in.type
    if tx_in.amount is not None:
        tx.amount = tx_in.amount
    if tx_in.category is not None:
        tx.category = tx_in.category
    if tx_in.date is not None:
        tx.date = tx_in.date
    if tx_in.description is not None:
        tx.description = tx_in.description

    db.add(tx)
    await db.commit()
    await db.refresh(tx)
    return FinanceTransactionResponse.model_validate(tx)


@router.delete("/{tx_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a finance transaction")
async def delete_finance_transaction(
    tx_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> None:
    result = await db.execute(
        select(FinanceTransaction).where(
            FinanceTransaction.id == tx_id,
            FinanceTransaction.user_id == current_user.id
        )
    )
    tx = result.scalar_one_or_none()
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    await db.delete(tx)
    await db.commit()
