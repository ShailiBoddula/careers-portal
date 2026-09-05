from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import get_settings
from app.api import auth, company, careers, sections, jobs, public

settings = get_settings()

app = FastAPI(
    title="Careers Miner API",
    description="Multi-tenant ATS Careers Page Builder & Miner Backend with JWT Auth, Section Reordering, and Public Job Boards",
    version="1.0.0",
)

origins = [
    settings.frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(company.router)
app.include_router(careers.router)
app.include_router(sections.router)
app.include_router(jobs.router)
app.include_router(public.router)


@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "service": "careers-page-builder-api",
        "env": settings.app_env,
    }
