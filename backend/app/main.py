"""FastAPI entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import Settings
from app.database.session import Base, engine
from app.routers import auth, users, events, registrations, admin

settings = Settings()

app = FastAPI(
    title="EventSphere API",
    version="1.0.0",
    description="Event management platform - REST API",
)

# CORS: allow local dev + deployed frontend URL
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    settings.FRONTEND_URL,
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=list({o for o in origins if o}),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Auto-create tables. For production, use Alembic migrations.
    Base.metadata.create_all(bind=engine)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "service": "EventSphere API", "docs": "/docs"}


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(events.router)
app.include_router(registrations.router)
app.include_router(admin.router)
