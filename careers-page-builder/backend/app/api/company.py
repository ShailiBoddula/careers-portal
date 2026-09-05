from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.models.models import User, Company
from app.schemas.schemas import CompanyUpdate, CompanyOut
from app.security.auth import require_recruiter
from app.exceptions.handlers import NotFoundError

router = APIRouter(prefix="/api/company", tags=["company"])


@router.get("/me", response_model=CompanyOut)
def get_my_company(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise NotFoundError("Company not found for this authenticated recruiter")
    return company


@router.put("/me", response_model=CompanyOut)
def update_my_company(
    payload: CompanyUpdate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise NotFoundError("Company not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(company, key, value)

    db.commit()
    db.refresh(company)
    return company
