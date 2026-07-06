"""
main.py — SRM University Portal · FastAPI Backend
Registers all routers including the new info_router.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth_router, info_router

app = FastAPI(
    title="SRM University Portal API",
    description="Full-stack university portal backend for SRMIST Kattankulathur",
    version="2.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router.router)
app.include_router(info_router.router)


@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "service": "SRM Portal API v2.0"}


@app.get("/api/v1/health", tags=["health"])
async def health():
    return {"status": "healthy", "version": "2.0.0"}
