"""Initial schema for PixelDesk models

Revision ID: 20261009_0001
Revises:
Create Date: 2026-10-09 09:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '20261009_0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create 'users' table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=100), nullable=True),
        sa.Column('avatar_config', sa.JSON(), nullable=True),
        sa.Column('settings', sa.JSON(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_users'))
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. Create 'tasks' table
    op.create_table(
        'tasks',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('due_date', sa.String(length=10), nullable=True),
        sa.Column('priority', sa.String(length=20), nullable=False, server_default='Medium'),
        sa.Column('category', sa.String(length=50), nullable=False, server_default='Other'),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_tasks_user_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_tasks'))
    )
    op.create_index(op.f('ix_tasks_completed'), 'tasks', ['completed'], unique=False)
    op.create_index(op.f('ix_tasks_due_date'), 'tasks', ['due_date'], unique=False)
    op.create_index(op.f('ix_tasks_user_id'), 'tasks', ['user_id'], unique=False)
    op.create_index('ix_tasks_user_completed', 'tasks', ['user_id', 'completed'], unique=False)
    op.create_index('ix_tasks_user_due_date', 'tasks', ['user_id', 'due_date'], unique=False)

    # 3. Create 'notes' table
    op.create_table(
        'notes',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('tags', sa.JSON(), nullable=False),
        sa.Column('accent', sa.String(length=30), nullable=False, server_default='lavender'),
        sa.Column('pinned', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_notes_user_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_notes'))
    )
    op.create_index(op.f('ix_notes_pinned'), 'notes', ['pinned'], unique=False)
    op.create_index(op.f('ix_notes_user_id'), 'notes', ['user_id'], unique=False)
    op.create_index('ix_notes_user_pinned', 'notes', ['user_id', 'pinned'], unique=False)

    # 4. Create 'calendar_events' table
    op.create_table(
        'calendar_events',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('date', sa.String(length=10), nullable=False),
        sa.Column('start_time', sa.String(length=10), nullable=True),
        sa.Column('end_time', sa.String(length=10), nullable=True),
        sa.Column('all_day', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('category', sa.String(length=50), nullable=False, server_default='Other'),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_calendar_events_user_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_calendar_events'))
    )
    op.create_index(op.f('ix_calendar_events_date'), 'calendar_events', ['date'], unique=False)
    op.create_index(op.f('ix_calendar_events_user_id'), 'calendar_events', ['user_id'], unique=False)
    op.create_index('ix_calendar_user_date', 'calendar_events', ['user_id', 'date'], unique=False)

    # 5. Create 'focus_sessions' table
    op.create_table(
        'focus_sessions',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('task_id', sa.String(length=64), nullable=True),
        sa.Column('task_title', sa.String(length=200), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=False, server_default='25'),
        sa.Column('mode', sa.String(length=30), nullable=False, server_default='focus'),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], name=op.f('fk_focus_sessions_task_id_tasks'), ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_focus_sessions_user_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_focus_sessions'))
    )
    op.create_index(op.f('ix_focus_sessions_completed_at'), 'focus_sessions', ['completed_at'], unique=False)
    op.create_index(op.f('ix_focus_sessions_task_id'), 'focus_sessions', ['task_id'], unique=False)
    op.create_index(op.f('ix_focus_sessions_user_id'), 'focus_sessions', ['user_id'], unique=False)
    op.create_index('ix_focus_user_completed_at', 'focus_sessions', ['user_id', 'completed_at'], unique=False)

    # 6. Create 'finance_transactions' table
    op.create_table(
        'finance_transactions',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('type', sa.String(length=20), nullable=False),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('date', sa.String(length=10), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_finance_transactions_user_id_users'), ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_finance_transactions'))
    )
    op.create_index(op.f('ix_finance_transactions_category'), 'finance_transactions', ['category'], unique=False)
    op.create_index(op.f('ix_finance_transactions_date'), 'finance_transactions', ['date'], unique=False)
    op.create_index(op.f('ix_finance_transactions_type'), 'finance_transactions', ['type'], unique=False)
    op.create_index(op.f('ix_finance_transactions_user_id'), 'finance_transactions', ['user_id'], unique=False)
    op.create_index('ix_finance_user_date', 'finance_transactions', ['user_id', 'date'], unique=False)
    op.create_index('ix_finance_user_type_date', 'finance_transactions', ['user_id', 'type', 'date'], unique=False)


def downgrade() -> None:
    op.drop_table('finance_transactions')
    op.drop_table('focus_sessions')
    op.drop_table('calendar_events')
    op.drop_table('notes')
    op.drop_table('tasks')
    op.drop_table('users')
