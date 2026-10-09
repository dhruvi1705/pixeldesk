import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.db.session import dispose_engine

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pixeldesk.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager for startup and clean shutdown.
    """
    logger.info("Starting %s (%s)...", settings.APP_NAME, settings.APP_VERSION)
    logger.info("Environment: %s", settings.APP_ENV)
    logger.info("Database Target: %s", settings.masked_database_url)
    logger.info("Allowed CORS Origins: %s", settings.FRONTEND_ORIGINS)
    yield
    logger.info("Shutting down %s...", settings.APP_NAME)
    await dispose_engine()
    logger.info("Shutdown complete.")


# Initialize FastAPI App
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="FastAPI Backend for PixelDesk Retro Productivity Workspace",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan
)

# Configure CORS Middleware safely
allowed_origins = settings.FRONTEND_ORIGINS
# Ensure we never use wildcard with credentials
allow_creds = True
if "*" in allowed_origins:
    allow_creds = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_creds,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "User-Agent"],
)


@app.get("/", tags=["Root"])
async def root():
    """
    Service root endpoint providing basic API metadata.
    """
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs": "/docs" if not settings.is_production else "disabled in production"
    }


@app.get("/health", tags=["System"])
async def health_check():
    """
    Lightweight process liveness check endpoint.
    """
    return {
        "status": "ok",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV
    }


# Mount Versioned API Routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)
