"""
Tasks CRUD API endpoints for PixelDesk.
Enforces strict user isolation: all operations are scoped to current_user.id.
"""

from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_active_user
from app.db.session import get_db_session
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate

router = APIRouter()


@router.get("", response_model=List[TaskResponse], summary="List all tasks for current user")
async def list_tasks(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    category: Optional[str] = Query(None, description="Filter by category")
) -> List[TaskResponse]:
    query = select(Task).where(Task.user_id == current_user.id)
    if completed is not None:
        query = query.where(Task.completed == completed)
    if category is not None:
        query = query.where(Task.category == category)
    query = query.order_by(desc(Task.created_at))

    result = await db.execute(query)
    tasks = result.scalars().all()
    return [TaskResponse.model_validate(t) for t in tasks]


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, summary="Create a new task")
async def create_task(
    task_in: TaskCreate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> TaskResponse:
    new_task = Task(
        user_id=current_user.id,
        title=task_in.title,
        description=task_in.description,
        due_date=task_in.due_date,
        priority=task_in.priority,
        category=task_in.category,
        completed=task_in.completed
    )
    if task_in.id:
        new_task.id = task_in.id

    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return TaskResponse.model_validate(new_task)


@router.get("/{task_id}", response_model=TaskResponse, summary="Get single task by ID")
async def get_task(
    task_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> TaskResponse:
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return TaskResponse.model_validate(task)


@router.patch("/{task_id}", response_model=TaskResponse, summary="Update an existing task")
async def update_task(
    task_id: str,
    task_in: TaskUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> TaskResponse:
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    if task_in.title is not None:
        task.title = task_in.title
    if task_in.description is not None:
        task.description = task_in.description
    if task_in.due_date is not None:
        task.due_date = task_in.due_date
    if task_in.priority is not None:
        task.priority = task_in.priority
    if task_in.category is not None:
        task.category = task_in.category
    if task_in.completed is not None:
        task.completed = task_in.completed

    db.add(task)
    await db.commit()
    await db.refresh(task)
    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a task")
async def delete_task(
    task_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)]
) -> None:
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    await db.delete(task)
    await db.commit()
