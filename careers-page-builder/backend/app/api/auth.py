from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.models.models import User
from app.schemas.schemas import LoginRequest, TokenResponse
from app.security.auth import verify_password, create_access_token
from app.exceptions.handlers import UnauthorizedError

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise UnauthorizedError("Invalid email or password")

    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "company_id": str(user.company_id) if user.company_id else None,
    }
    token = create_access_token(token_data)

    company_slug = user.company.slug if user.company else None
    company_name = user.company.name if user.company else None

    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
        role=user.role,
        company_id=str(user.company_id) if user.company_id else None,
        company_slug=company_slug,
        company_name=company_name,
    )
