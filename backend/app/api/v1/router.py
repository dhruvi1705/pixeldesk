from fastapi import APIRouter
from app.core.config import settings
from app.db.session import check_db_connectivity
from app.api.v1.auth import router as auth_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.notes import router as notes_router
from app.api.v1.calendar import router as calendar_router
from app.api.v1.focus import router as focus_router
from app.api.v1.finance import router as finance_router

api_router = APIRouter()

# Health endpoints
@api_router.get("/health", tags=["System"])
async def versioned_health():
    """
    Versioned API health endpoint.
    Performs a real ping to verify database connectivity.
    """
    db_status = await check_db_connectivity()
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
        "database": db_status
    }

# Authentication and user endpoints
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# User-scoped productivity CRUD endpoints
api_router.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])
api_router.include_router(notes_router, prefix="/notes", tags=["Notes"])
api_router.include_router(calendar_router, prefix="/calendar", tags=["Calendar"])
api_router.include_router(focus_router, prefix="/focus", tags=["Focus"])
api_router.include_router(finance_router, prefix="/finance", tags=["Finance"])
