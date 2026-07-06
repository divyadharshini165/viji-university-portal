"""
auth_router.py — JWT Authentication Router
Handles login, token validation, and demo credentials.
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt
import bcrypt

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)

# ── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = "srm-ktr-super-secret-jwt-key-2024-change-in-production"
ALGORITHM  = "HS256"
TOKEN_EXPIRE_HOURS = 12

# ── Demo user database (replace with MongoDB lookup in production) ─────────────
# Passwords are bcrypt-hashed. Demo password: "SRM@2024"
DEMO_USERS = {
    "RA2311003010001": {
        "password_hash": bcrypt.hashpw(b"SRM@2024", bcrypt.gensalt()).decode(),
        "name":   "Arjun Sharma",
        "branch": "B.Tech CSE",
        "semester": 4,
        "cgpa":   9.12,
        "email":  "arjun.sharma@srmist.edu.in",
    },
    "RA2311003010002": {
        "password_hash": bcrypt.hashpw(b"SRM@2024", bcrypt.gensalt()).decode(),
        "name":   "Priya Nair",
        "branch": "B.Tech ECE",
        "semester": 4,
        "cgpa":   8.95,
        "email":  "priya.nair@srmist.edu.in",
    },
    # Generic demo account
    "demo": {
        "password_hash": bcrypt.hashpw(b"demo123", bcrypt.gensalt()).decode(),
        "name":   "Demo Student",
        "branch": "B.Tech CSE",
        "semester": 4,
        "cgpa":   8.50,
        "email":  "demo@srmist.edu.in",
    },
}


# ── Schemas ───────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    registration_number: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    student: dict


class StudentProfile(BaseModel):
    registration_number: str
    name: str
    branch: str
    semester: int
    cgpa: float
    email: str


# ── Helpers ───────────────────────────────────────────────────────────────────
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return verify_token(credentials.credentials)


# ── Routes ────────────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse, summary="Authenticate student and return JWT")
async def login(payload: LoginRequest):
    reg_no = payload.registration_number.strip()
    user   = DEMO_USERS.get(reg_no)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid registration number or password",
        )

    password_valid = bcrypt.checkpw(
        payload.password.encode(),
        user["password_hash"].encode(),
    )
    if not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid registration number or password",
        )

    token = create_access_token(
        data={"sub": reg_no, "name": user["name"], "branch": user["branch"]},
        expires_delta=timedelta(hours=TOKEN_EXPIRE_HOURS),
    )

    return TokenResponse(
        access_token=token,
        expires_in=TOKEN_EXPIRE_HOURS * 3600,
        student={
            "registration_number": reg_no,
            "name":     user["name"],
            "branch":   user["branch"],
            "semester": user["semester"],
            "cgpa":     user["cgpa"],
            "email":    user["email"],
        },
    )


@router.get("/me", summary="Get current authenticated student profile")
async def get_me(current_user: dict = Depends(get_current_user)):
    reg_no = current_user.get("sub")
    user   = DEMO_USERS.get(reg_no)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "registration_number": reg_no,
        "name":     user["name"],
        "branch":   user["branch"],
        "semester": user["semester"],
        "cgpa":     user["cgpa"],
        "email":    user["email"],
    }


@router.post("/logout", summary="Logout (client should discard token)")
async def logout():
    # JWT is stateless; logout is handled client-side by discarding the token.
    # For production, maintain a token blacklist in Redis.
    return {"message": "Logged out successfully. Please discard your token."}


# ── Registration / Account Activation ────────────────────────────────────────
class RegisterRequest(BaseModel):
    registration_number: str
    password: str
    name: str
    branch: str
    semester: int = 1
    cgpa: float = 8.0
    email: str = ""


@router.post("/register", summary="Seed / activate a new student account (dev + testing)")
async def register(payload: RegisterRequest):
    """
    Seeds a student profile into the in-memory DEMO_USERS store.
    In production this would write to MongoDB. Useful for first-time
    account activation and integration testing without manual DB seeding.
    Returns 409 if the registration number already exists.
    """
    reg_no = payload.registration_number.strip().upper()

    if reg_no in DEMO_USERS:
        # Return the existing profile rather than an error so the frontend
        # can still auto-fill and log in without a confusing 409 screen.
        return {
            "message": f"Account {reg_no} already exists — credentials unchanged.",
            "registration_number": reg_no,
        }

    # Hash the supplied password and register in-memory
    password_hash = bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode()
    DEMO_USERS[reg_no] = {
        "password_hash": password_hash,
        "name":     payload.name,
        "branch":   payload.branch,
        "semester": payload.semester,
        "cgpa":     payload.cgpa,
        "email":    payload.email or f"{reg_no.lower()}@srmist.edu.in",
    }

    return {
        "message": f"Account {reg_no} activated successfully.",
        "registration_number": reg_no,
        "name":   payload.name,
        "branch": payload.branch,
    }
