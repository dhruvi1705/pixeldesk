# ⚡ PixelDesk FastAPI Backend

> Scalable, asynchronous Python backend foundation for PixelDesk, built with FastAPI, SQLAlchemy 2.0, and asyncpg.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (0.115+)
- **ASGI Web Server:** [Uvicorn](https://www.uvicorn.org/)
- **ORM & Async Engine:** [SQLAlchemy](https://www.sqlalchemy.org/) (2.0+) with `asyncpg`
- **Database Migrations:** [Alembic](https://alembic.sqlalchemy.org/) (1.13+)
- **Cryptography & Security:** `bcrypt` (password hashing) & `PyJWT` (signed token claims)
- **Database Driver:** `asyncpg` (Asynchronous PostgreSQL driver)
- **Settings & Validation:** [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/) (v2)
- **Testing:** [pytest](https://docs.pytest.org/) & [HTTPX](https://www.python-httpx.org/)

---

## 📁 Directory Structure

```
backend/
├── alembic/
│   ├── versions/
│   │   └── 20261009_0001_initial_schema.py # Initial migration revision
│   ├── env.py                              # Async Alembic environment runner
│   └── script.py.mako                      # Migration template
├── app/
│   ├── api/
│   │   ├── deps.py                         # Auth & DB dependencies
│   │   └── v1/
│   │       ├── auth.py                     # Signup, login, & user profile endpoints
│   │       ├── tasks.py                    # Tasks CRUD endpoints
│   │       ├── notes.py                    # Notes CRUD endpoints
│   │       ├── calendar.py                 # Calendar events CRUD endpoints
│   │       ├── focus.py                    # Focus sessions logging & history endpoints
│   │       ├── finance.py                  # Finance transactions CRUD endpoints
│   │       └── router.py                   # Versioned API routes & health checks
│   ├── core/
│   │   ├── config.py                       # Pydantic Settings & environment validation
│   │   └── security.py                     # Bcrypt hashing & PyJWT signing
│   ├── db/
│   │   └── session.py                      # Async engine, session factory & health pings
│   ├── models/
│   │   ├── __init__.py                     # Model exports
│   │   ├── base.py                         # Base class, metadata & TimestampMixin
│   │   ├── user.py                         # User account model & child cascades
│   │   ├── task.py                         # Task model & compound indexes
│   │   ├── note.py                         # Note model & JSON tags
│   │   ├── calendar_event.py               # CalendarEvent model & date indexes
│   │   ├── focus_session.py                # FocusSession model & task linkage
│   │   └── finance_transaction.py          # FinanceTransaction with Numeric(12,2)
│   ├── schemas/
│   │   ├── __init__.py                     # Schema exports
│   │   ├── token.py                        # JWT Token response & payload schemas
│   │   ├── user.py                         # User creation, login, & response schemas
│   │   ├── task.py                         # Task create, update, response schemas
│   │   ├── note.py                         # Note create, update, response schemas
│   │   ├── calendar_event.py               # Calendar event schemas
│   │   ├── focus_session.py                # Focus session log and history schemas
│   │   └── finance_transaction.py          # Finance transaction schemas (exact decimal)
│   ├── __init__.py
│   └── main.py                             # FastAPI application entrypoint & CORS
├── tests/
│   ├── conftest.py                         # Test client fixtures
│   ├── test_auth.py                        # Password hashing, JWT & endpoint tests
│   ├── test_crud_isolation.py              # Full CRUD multi-tenant isolation tests
│   ├── test_health.py                      # Unit & integration health tests
│   ├── test_models.py                      # Model metadata, FK, & Alembic tests
│   ├── test_security_isolation.py          # Profile isolation & token tests
│   └── __init__.py
├── .env.example                            # Environment template
├── alembic.ini                             # Alembic configuration
├── Dockerfile                              # Container definition for Render/Docker
├── requirements.txt                        # Production and test dependencies
└── README.md
```

---

## 🔐 Security & Authentication Architecture

1. **Password Hashing:**
   - Passwords are securely hashed with `bcrypt` (12 salt rounds) before database persistence.
   - Plaintext passwords are never logged, stored, or exposed.
   - Max password length limit (128 bytes) is enforced to prevent algorithmic DoS.

2. **JWT Access Tokens:**
   - Tokens are cryptographically signed using HMAC-SHA256 (`HS256`) and a secret loaded from environment settings.
   - Tokens contain claims: `sub` (User ID), `email`, `iat`, `nbf`, `exp`, `iss`.
   - Token decoding strictly enforces `verify_signature=True` and `verify_exp=True`.

3. **Per-User Authorization & Multi-Tenant Isolation:**
   - Every private CRUD endpoint derives `user_id` strictly from `get_current_active_user`.
   - Client-supplied `user_id` values in request bodies are ignored or rejected.
   - Task reference validation: Focus sessions verify that referenced `task_id` belongs to the authenticated user before recording.
   - 404 responses are returned for queries targeting another user's records to prevent data leaking.

---

## 📡 Available Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API service metadata & documentation links | No |
| `GET` | `/health` | Lightweight process liveness check | No |
| `GET` | `/api/v1/health` | Versioned system health & live PostgreSQL status | No |
| `POST` | `/api/v1/auth/signup` | Register new user account (returns JWT token) | No |
| `POST` | `/api/v1/auth/login` | Authenticate email/password (returns JWT token) | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | **Yes (Bearer JWT)** |
| `PATCH`| `/api/v1/auth/me` | Update authenticated user profile / settings | **Yes (Bearer JWT)** |
| `GET` | `/api/v1/tasks` | List authenticated user tasks | **Yes (Bearer JWT)** |
| `POST` | `/api/v1/tasks` | Create task for authenticated user | **Yes (Bearer JWT)** |
| `GET` | `/api/v1/tasks/{id}` | Get specific task | **Yes (Bearer JWT)** |
| `PATCH`| `/api/v1/tasks/{id}` | Update task | **Yes (Bearer JWT)** |
| `DELETE`|`/api/v1/tasks/{id}` | Delete task | **Yes (Bearer JWT)** |
| `GET` | `/api/v1/notes` | List authenticated user notes | **Yes (Bearer JWT)** |
| `POST` | `/api/v1/notes` | Create note for authenticated user | **Yes (Bearer JWT)** |
| `GET` | `/api/v1/notes/{id}` | Get specific note | **Yes (Bearer JWT)** |
| `PATCH`| `/api/v1/notes/{id}` | Update note | **Yes (Bearer JWT)** |
| `DELETE`|`/api/v1/notes/{id}` | Delete note | **Yes (Bearer JWT)** |
| `GET` | `/api/v1/calendar` | List calendar events | **Yes (Bearer JWT)** |
| `POST` | `/api/v1/calendar` | Create calendar event | **Yes (Bearer JWT)** |
| `GET` | `/api/v1/calendar/{id}`| Get specific calendar event | **Yes (Bearer JWT)** |
| `PATCH`| `/api/v1/calendar/{id}`| Update calendar event | **Yes (Bearer JWT)** |
| `DELETE`|`/api/v1/calendar/{id}`| Delete calendar event | **Yes (Bearer JWT)** |
| `GET` | `/api/v1/focus` | List completed focus sessions | **Yes (Bearer JWT)** |
| `POST` | `/api/v1/focus` | Log completed focus session | **Yes (Bearer JWT)** |
| `DELETE`|`/api/v1/focus/{id}` | Delete focus session | **Yes (Bearer JWT)** |
| `GET` | `/api/v1/finance` | List finance transactions | **Yes (Bearer JWT)** |
| `POST` | `/api/v1/finance` | Create finance transaction | **Yes (Bearer JWT)** |
| `GET` | `/api/v1/finance/{id}` | Get specific finance transaction | **Yes (Bearer JWT)** |
| `PATCH`| `/api/v1/finance/{id}` | Update finance transaction | **Yes (Bearer JWT)** |
| `DELETE`|`/api/v1/finance/{id}` | Delete finance transaction | **Yes (Bearer JWT)** |
| `GET` | `/docs` | Interactive Swagger API documentation | No |
| `GET` | `/redoc` | Interactive ReDoc documentation | No |

---

## 🧪 Running Automated Tests

Run the test suite with pytest from the `backend/` directory:

```bash
pytest tests
```
