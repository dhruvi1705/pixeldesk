import asyncio
import logging
from typing import AsyncGenerator, Dict, Any
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine
)
from sqlalchemy import text
from app.core.config import settings

logger = logging.getLogger("pixeldesk.db")

# 1. Async Database Engine
engine: AsyncEngine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_pre_ping=True
)

# 2. Async Session Factory
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)


# 3. FastAPI Database Session Dependency
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency yielding an async database session per request.
    Automatically rolls back on unhandled exceptions and closes on completion.
    """
    async with async_session_factory() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error("Database session rolled back due to error: %s", e)
            raise
        finally:
            await session.close()


# 4. Independent Database Connectivity Check
async def check_db_connectivity(timeout_seconds: float = 3.0) -> Dict[str, Any]:
    """
    Ping PostgreSQL database with 'SELECT 1' to verify connectivity.
    Never raises unhandled exceptions to prevent crashing health checks.
    """
    try:
        async with asyncio.timeout(timeout_seconds):
            async with engine.connect() as conn:
                result = await conn.execute(text("SELECT 1"))
                row = result.scalar()
                if row == 1:
                    return {
                        "connected": True,
                        "status": "healthy",
                        "details": "PostgreSQL connection operational"
                    }
                return {
                    "connected": False,
                    "status": "unhealthy",
                    "details": "Unexpected query result"
                }
    except asyncio.TimeoutError:
        return {
            "connected": False,
            "status": "unhealthy",
            "details": f"Database ping timed out after {timeout_seconds}s"
        }
    except Exception as exc:
        return {
            "connected": False,
            "status": "unhealthy",
            "details": f"Database connection failed: {exc.__class__.__name__}"
        }


# 5. Clean Engine Disposal on Shutdown
async def dispose_engine() -> None:
    """Dispose of the SQLAlchemy async engine connection pool."""
    logger.info("Disposing PostgreSQL connection pool...")
    await engine.dispose()
    logger.info("PostgreSQL connection pool disposed cleanly.")
