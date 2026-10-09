"""
Unit tests for SQLAlchemy 2.x database models, metadata, relationships,
indexes, column constraints, and Alembic migration configuration.
These tests run entirely in-memory against SQLAlchemy metadata and do not require
a live database connection.
"""

from decimal import Decimal
# pyrefly: ignore [missing-import]
import sqlalchemy as sa
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import class_mapper

from app.models.base import Base, TimestampMixin
from app.models.user import User
from app.models.task import Task
from app.models.note import Note
from app.models.calendar_event import CalendarEvent
from app.models.focus_session import FocusSession
from app.models.finance_transaction import FinanceTransaction


def test_base_metadata_contains_all_tables():
    """Verify that Base.metadata has registered all 6 application tables."""
    table_names = Base.metadata.tables.keys()
    expected_tables = {
        "users",
        "tasks",
        "notes",
        "calendar_events",
        "focus_sessions",
        "finance_transactions",
    }
    assert expected_tables.issubset(table_names), f"Missing tables: {expected_tables - set(table_names)}"


def test_naming_convention_applied():
    """Verify standard constraint naming conventions are configured on Base.metadata."""
    conventions = Base.metadata.naming_convention
    assert conventions.get("ix") == "ix_%(column_0_label)s"
    assert conventions.get("uq") == "uq_%(table_name)s_%(column_0_name)s"
    assert conventions.get("ck") == "ck_%(table_name)s_%(constraint_name)s"
    assert conventions.get("fk") == "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
    assert conventions.get("pk") == "pk_%(table_name)s"


def test_user_model_columns_and_constraints():
    """Verify User model columns, types, nullability, and unique constraints."""
    table = Base.metadata.tables["users"]

    assert "id" in table.columns
    assert "email" in table.columns
    assert "hashed_password" in table.columns
    assert "full_name" in table.columns
    assert "avatar_config" in table.columns
    assert "settings" in table.columns
    assert "is_active" in table.columns
    assert "created_at" in table.columns
    assert "updated_at" in table.columns

    # Check nullability
    assert table.columns["id"].primary_key is True
    assert table.columns["email"].nullable is False
    assert table.columns["hashed_password"].nullable is False
    assert table.columns["full_name"].nullable is True
    assert table.columns["is_active"].nullable is False

    # Check unique indexes
    unique_columns = {col.name for col in table.columns if col.unique}
    assert "email" in unique_columns


def test_user_model_relationships():
    """Verify User model has declared relationships to all dependent models with cascades."""
    mapper = class_mapper(User)
    relationships = {rel.key: rel for rel in mapper.relationships}

    assert "tasks" in relationships
    assert "notes" in relationships
    assert "calendar_events" in relationships
    assert "focus_sessions" in relationships
    assert "finance_transactions" in relationships

    for rel_name in ["tasks", "notes", "calendar_events", "focus_sessions", "finance_transactions"]:
        rel = relationships[rel_name]
        assert "delete-orphan" in rel.cascade or "delete" in rel.cascade, f"Cascade delete missing on {rel_name}"


def test_task_model_columns_and_foreign_keys():
    """Verify Task model structure, foreign keys, and indexes."""
    table = Base.metadata.tables["tasks"]

    assert "id" in table.columns
    assert "user_id" in table.columns
    assert "title" in table.columns
    assert "description" in table.columns
    assert "due_date" in table.columns
    assert "priority" in table.columns
    assert "category" in table.columns
    assert "completed" in table.columns
    assert "created_at" in table.columns
    assert "updated_at" in table.columns

    # Foreign key check
    fks = list(table.foreign_keys)
    assert len(fks) == 1
    fk = fks[0]
    assert fk.column.table.name == "users"
    assert fk.column.name == "id"
    assert fk.ondelete == "CASCADE"

    # Index check
    index_names = {idx.name for idx in table.indexes}
    assert any("user_id" in [c.name for c in idx.columns] for idx in table.indexes)


def test_note_model_columns_and_tags_json():
    """Verify Note model structure, JSON tags, and pinned index."""
    table = Base.metadata.tables["notes"]

    assert "id" in table.columns
    assert "user_id" in table.columns
    assert "title" in table.columns
    assert "content" in table.columns
    assert "tags" in table.columns
    assert "accent" in table.columns
    assert "pinned" in table.columns

    # Foreign key check
    fks = list(table.foreign_keys)
    assert len(fks) == 1
    assert fks[0].column.table.name == "users"
    assert fks[0].ondelete == "CASCADE"

    # JSON type verification for tags
    assert isinstance(table.columns["tags"].type, (sa.JSON, sa.dialects.postgresql.JSONB))


def test_calendar_event_model():
    """Verify CalendarEvent model structure and date fields."""
    table = Base.metadata.tables["calendar_events"]

    assert "id" in table.columns
    assert "user_id" in table.columns
    assert "title" in table.columns
    assert "description" in table.columns
    assert "date" in table.columns
    assert "start_time" in table.columns
    assert "end_time" in table.columns
    assert "all_day" in table.columns
    assert "category" in table.columns

    fks = list(table.foreign_keys)
    assert len(fks) == 1
    assert fks[0].column.table.name == "users"
    assert fks[0].ondelete == "CASCADE"


def test_focus_session_model():
    """Verify FocusSession model structure, User FK cascade, and Task FK set null."""
    table = Base.metadata.tables["focus_sessions"]

    assert "id" in table.columns
    assert "user_id" in table.columns
    assert "task_id" in table.columns
    assert "task_title" in table.columns
    assert "duration_minutes" in table.columns
    assert "mode" in table.columns
    assert "completed_at" in table.columns
    assert "created_at" in table.columns

    fk_map = {fk.column.table.name: fk for fk in table.foreign_keys}
    assert "users" in fk_map
    assert fk_map["users"].ondelete == "CASCADE"
    assert "tasks" in fk_map
    assert fk_map["tasks"].ondelete == "SET NULL"


def test_finance_transaction_fixed_precision_amount():
    """Verify FinanceTransaction stores amount with fixed decimal precision (not float)."""
    table = Base.metadata.tables["finance_transactions"]

    assert "id" in table.columns
    assert "user_id" in table.columns
    assert "type" in table.columns
    assert "amount" in table.columns
    assert "category" in table.columns
    assert "description" in table.columns
    assert "date" in table.columns

    amount_col = table.columns["amount"]
    assert isinstance(amount_col.type, sa.Numeric), f"Expected Numeric type for currency, got {type(amount_col.type)}"
    assert amount_col.type.precision == 12
    assert amount_col.type.scale == 2
    assert amount_col.nullable is False

    fks = list(table.foreign_keys)
    assert len(fks) == 1
    assert fks[0].column.table.name == "users"
    assert fks[0].ondelete == "CASCADE"


def test_alembic_config_and_script_discovery():
    """Verify Alembic config can parse alembic.ini and discover target metadata."""
    from alembic.config import Config
    from alembic.script import ScriptDirectory

    cfg = Config("alembic.ini")
    script = ScriptDirectory.from_config(cfg)

    # Check head revision exists
    heads = script.get_heads()
    assert len(heads) == 1
    assert heads[0] == "20261009_0001"

    head_rev = script.get_revision(heads[0])
    assert "Initial schema for PixelDesk models" in head_rev.doc
